import { Box, Button, CircularProgress, Spinner } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Comments from '../../components/Comments';
import Layout from '../../components/Layout';
import PostItem from '../../components/PostItem';
import {
  PaginationInput,
  useCommentsQuery,
  usePostQuery,
} from '../../generated/graphql';

const Post: React.FC = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [input, setInput] = useState<PaginationInput>({
    limit: 4,
    cursor: null,
  });

  const { data, loading } = usePostQuery({
    skip: id === '',
    variables: {
      id,
    },
  });
  const {
    data: commentsData,
    loading: commentsLoading,
    fetchMore,
    variables,
  } = useCommentsQuery({
    notifyOnNetworkStatusChange: true,
    skip: id === '',
    variables: { postId: id, input },
  });

  useEffect(() => {
    console.log(commentsData);
  }, [commentsData]);

  const fetchMoreComments = async () => {
    await fetchMore({
      variables: {
        input: {
          limit: variables?.input.limit,
          cursor: commentsData!.comments.comments[
            commentsData!.comments.comments.length - 1
          ].createdAt,
        },
      },
    });
  };

  if (!data?.post || loading)
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
          commentsData && (
            <Comments
              fetchMore={fetchMoreComments}
              postId={data.post.id}
              comments={commentsData!.comments.comments}
            />
          )
        )}
        {commentsData?.comments.hasMore && (
          <Button
            w="100%"
            variantColor="blue"
            mb={8}
            isLoading={commentsLoading}
            onClick={() => {
              fetchMore({
                variables: {
                  input: {
                    limit: variables?.input.limit,
                    cursor:
                      commentsData.comments.comments[
                        commentsData.comments.comments.length - 1
                      ].createdAt,
                  },
                },
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

export default Post;
