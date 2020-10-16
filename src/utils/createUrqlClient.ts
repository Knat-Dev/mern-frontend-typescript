import {
  Cache,
  cacheExchange,
  DataField,
  Resolver,
} from '@urql/exchange-graphcache';
import { SSRExchange } from 'next-urql';
import Router from 'next/router';
import {
  ClientOptions,
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import { pipe, tap } from 'wonka';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  PostQuery,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import { meQueryUpdateAfterLogin } from './meQueryUpdateAfterLogin';
import gql from 'graphql-tag';
import { isServer } from './isServer';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error?.message.includes('Not Authenticated')) {
        Router.replace('/login');
      }
    })
  );
};

const invalidatePosts = (cache: Cache) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'posts', fi.arguments || {});
  });
};

const invalidatePost = (cache: Cache, id: string) => {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'post');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'post', { id });
  });
};

const cursorPaginationComments = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const results: DataField[] = [];

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isFieldKeyInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'comments'
    );
    console.log(isFieldKeyInCache);
    info.partial = !isFieldKeyInCache;

    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'comments');
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) hasMore = _hasMore as boolean;
      results.push(...data);
    });

    // console.log(
    //     'info ',
    //     'entityKey: ' + entityKey,
    //     'fieldName: ' + fieldName,
    //     'fieldInfos: ' + JSON.stringify(fieldInfos)
    // );
    return {
      __typename: 'PaginatedComments',
      hasMore,
      comments: results,
    };
  };
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const results: DataField[] = [];

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isFieldKeyInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isFieldKeyInCache;

    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts');
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) hasMore = _hasMore as boolean;
      results.push(...data);
    });
    // console.log(
    //     'info ',
    //     'entityKey: ' + entityKey,
    //     'fieldName: ' + fieldName,
    //     'fieldInfos: ' + JSON.stringify(fieldInfos)
    // );
    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (
  ssrExchange: SSRExchange,
  ctx: any
): ClientOptions => {
  let cookie = '';
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: 'include',
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          Post: {
            comments: cursorPaginationComments(),
            // comments: (parent: any, args, cache, info) => {
            //   console.log(parent.comments);
            //   console.log(args);
            //   console.log(info);
            //   return parent.comments;
            // },
          },
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              const { id } = args as DeletePostMutationVariables;
              cache.invalidate({ __typename: 'Post', id });
            },
            createComment: (_result, args, cache, _info) => {
              const { postId } = args as CreateCommentMutationVariables;
              cache.invalidate({ __typename: 'Post', id: postId });
              // invalidatePost(cache, postId);
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { _id: postId } as any
              );
              console.log(data);
              if (data) {
                if (data.voteStatus === value) return;
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { _id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            createPost: (_result, args, cache, info) => {
              console.log(_result, args, info);
              invalidatePosts(cache);
            },
            login: (_result, args, cache, info) => {
              invalidatePosts(cache);

              meQueryUpdateAfterLogin<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else
                    return {
                      me: result.login.user,
                    };
                }
              );
            },
            register: (_result, args, cache, info) => {
              meQueryUpdateAfterLogin<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else
                    return {
                      me: result.register.user,
                    };
                }
              );
            },
            logout: (_result, args, cache, info) => {
              invalidatePosts(cache);

              meQueryUpdateAfterLogin<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({
                  me: null,
                })
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
