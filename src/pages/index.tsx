import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  CloseButton,
  Flex,
  Heading,
  Stack,
} from '@chakra-ui/core';
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import PostItem from '../components/PostItem';
import { usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/ApolloClient';

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      input: {
        limit: 15,
        cursor: null as number | null,
      },
    },
  });

  let ErrorEl = (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Oops!</AlertTitle>
      <AlertDescription>
        We've had a problem with your query, please try again later.
      </AlertDescription>
      <CloseButton position="absolute" right="8px" top="8px" />
    </Alert>
  );

  return (
    <>
      <Head>
        <title>Knat Dev</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout variant="regular">
        <Flex
          flexDirection="column"
          padding={['10px', '10px', 0]}
          paddingTop={[0]}
        >
          <Heading
            fontWeight="light"
            size="2xl"
            textAlign="center"
            mb={8}
            color="blue.500"
          >
            A Reddit Clone
          </Heading>
          <NextLink href="/create-post">
            <Button
              w="100%"
              fontSize="xl"
              fontWeight="normal"
              variantColor="blue"
              mb={8}
            >
              Create Post
            </Button>
          </NextLink>
          {!data && loading ? (
            <Box alignSelf="center">
              <CircularProgress isIndeterminate color="blue" />
            </Box>
          ) : !data ? (
            <div>{ErrorEl}</div>
          ) : (
            <Stack spacing={8}>
              {data.posts.posts.map((p) =>
                p ? <PostItem key={p.id} post={p} /> : null
              )}
            </Stack>
          )}
          {data?.posts.hasMore && (
            <Button
              w="100%"
              variantColor="blue"
              mb={8}
              isLoading={loading}
              onClick={() => {
                fetchMore({
                  variables: {
                    input: {
                      limit: variables?.input.limit,
                      cursor:
                        data.posts.posts[data.posts.posts.length - 1].createdAt,
                    },
                  },
                  // updateQuery: (
                  //   previousValue: PostsQuery,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   console.log(fetchMoreResult);
                  //   if (!fetchMoreResult) return previousValue;
                  //   return {
                  //     __typename: 'Query',
                  //     posts: {
                  //       __typename: 'PaginatedPosts',
                  //       posts: [
                  //         ...previousValue.posts.posts,
                  //         ...fetchMoreResult.posts.posts,
                  //       ],
                  //       hasMore: fetchMoreResult.posts.hasMore,
                  //     },
                  //   };
                  // },
                });
              }}
            >
              Load More
            </Button>
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default withApollo(Index, { ssr: true });
