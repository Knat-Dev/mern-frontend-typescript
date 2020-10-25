import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  isReference,
} from '@apollo/client';
import { NextPageContext } from 'next';
import { PaginatedComments, PaginatedPosts, Post } from '../generated/graphql';
import { createWithApollo } from './createWithApollo';
import { onError } from '@apollo/client/link/error';
import Router from 'next/router';
import { isServer } from './isServer';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      if (message.includes('Not Authenticated'))
        return Router.replace('/login');
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = errorLink.concat(httpLink);

const apolloClient = (ctx: NextPageContext) =>
  new ApolloClient({
    headers: {
      cookie:
        (typeof window === 'undefined' ? ctx?.req?.headers.cookie : '') || '',
    },
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            comments: {
              keyArgs: ['postId'],
              merge(
                existing: PaginatedComments | undefined,
                incoming: PaginatedComments
              ): PaginatedComments {
                console.log(existing, incoming);
                return {
                  ...incoming,
                  comments: [
                    ...(existing?.comments || []),
                    ...incoming.comments,
                  ],
                };
              },
            },
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
            // post: {
            //   merge(existing: Post | undefined, incoming: Post): Post {
            //     console.log(isReference(incoming));
            //     // console.log();
            //     return incoming;
            //   },
            // },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(apolloClient);
