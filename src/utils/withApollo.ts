import { withApollo as createWithApollo } from 'next-apollo';
import { ApolloClient, InMemoryCache, isReference } from '@apollo/client';
import { PaginatedComments, PaginatedPosts, Post } from '../generated/graphql';
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,

  credentials: 'include',
  headers: {},
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          comments: {
            keyArgs: ['input'],
            merge(
              existing: PaginatedComments | undefined,
              incoming: PaginatedComments
            ): PaginatedComments {
              console.log(existing, incoming);
              return {
                ...incoming,
                comments: [...(existing?.comments || []), ...incoming.comments],
              };
            },
          },
        },
      },
      Query: {
        fields: {
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
          post: {
            merge(existing: Post | undefined, incoming: Post): Post {
              console.log(isReference(incoming));
              // console.log();
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export const withApollo = createWithApollo(apolloClient);
