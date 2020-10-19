import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Grid,
  Heading,
  Spinner,
} from '@chakra-ui/core';
import moment from 'moment';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Comments from '../../components/Comments';
import EditDeleteButtons from '../../components/EditDeleteButtons';
import Layout from '../../components/Layout';
import PostItem from '../../components/PostItem';
import {
  PaginationInput,
  PostsQuery,
  useMeQuery,
  usePostQuery,
} from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withApollo } from '../../utils/withApollo';

interface Props {
  post: PostsQuery['posts']['posts'][0];
}

const Post: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [input, setInput] = useState<PaginationInput>({
    limit: 4,
    cursor: null,
  });
  const { data, error, loading, variables, fetchMore } = usePostQuery({
    skip: id === '',
    notifyOnNetworkStatusChange: false,
    variables: {
      id,
      input,
    },
  });

  const fetchMoreComments = async () => {
    await fetchMore({
      variables: {
        input: {
          limit: variables?.input.limit,
          cursor:
            data?.post?.comments.comments[
              data?.post?.comments.comments.length - 1
            ].createdAt,
        },
      },
    });
  };

  if (loading || !data?.post)
    return (
      <Layout horizontalCenter>
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      </Layout>
    );

  if (error?.message) return <div>{error.message}</div>;

  if (!data?.post)
    return (
      <Layout>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="150px"
        >
          <AlertIcon size="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Post could not be found!
          </AlertTitle>
        </Alert>
      </Layout>
    );

  return (
    <Layout>
      <Box p={['10px', '10px', 0]}>
        <Box mb={8}>
          <PostItem post={data.post} isPostPage />
        </Box>
        {!data && loading ? (
          <Box alignSelf="center">
            <CircularProgress isIndeterminate color="blue" />
          </Box>
        ) : !data.post ? (
          <div>error!</div>
        ) : (
          <Comments
            fetchMore={fetchMoreComments}
            input={input}
            setInput={setInput}
            postId={data.post.id}
            comments={data.post.comments.comments}
          />
        )}
        {data?.post?.comments.hasMore && (
          <Button
            w="100%"
            variantColor="blue"
            mb={8}
            onClick={() => {
              setInput({
                limit: input.limit,
                cursor:
                  data.post?.comments.comments[
                    data.post.comments.comments.length - 1
                  ].createdAt,
              });
            }}
          >
            Load More
          </Button>
        )}
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
