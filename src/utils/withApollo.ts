import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import Router from 'next/router';
import { PaginatedComments, PaginatedPosts } from '../generated/graphql';
import { getAccessToken, setAccessToken } from './accessToken';
import { createWithApollo } from './createWithApollo';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  let token = getAccessToken();
  if (token) sessionStorage.setItem('access_token', token);
  else token = sessionStorage.getItem('access_token');
  console.log('the auth token is: ', token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      if (message.includes('Not Authenticated')) {
        console.log('auth');
        return Router.replace('/login');
      }
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
      const { exp } = jwtDecode(token) as { exp: number };
      if (Date.now() >= exp * 1000) return false;
      else return true;
    } catch (e) {
      return false;
    }
  },
  fetchAccessToken: async (): Promise<Response> => {
    return fetch('http://localhost:8080/refresh', {
      credentials: 'include',
      method: 'POST',
    });
  },
  handleFetch: (accessToken: string) => {
    console.log('refreshed...');
    setAccessToken(accessToken);
  },
  handleError: (err: Error) => {
    console.error(err);
  },
});

// const link = errorLink.concat(httpLink);

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    tokenRefreshLink as any,
    authLink,
    errorLink,
    httpLink,
  ]),
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
                comments: [...(existing?.comments || []), ...incoming.comments],
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
