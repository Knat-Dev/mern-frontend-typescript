import { Box, IconButton } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PostQuery,
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from '../generated/graphql';

interface Props {
  post: PostsQuery['posts']['posts'][0];
}

const EditDeleteButtons: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const [{ data }] = useMeQuery();
  const [{ fetching }, deletePost] = useDeletePostMutation();

  return data?.me?.id !== post.creator.id ? null : (
    <Box>
      <IconButton
        mr={2}
        icon="delete"
        aria-label="Delete Post"
        variant="outline"
        isLoading={fetching}
        onClick={async () => {
          await deletePost({ id: post.id });
          if (router.pathname.includes('/post')) router.push('/');
        }}
      />
      <IconButton
        icon="edit"
        aria-label="Edit Post"
        variant="outline"
        onClick={async () => {
          router.push(`/post/edit/${post.id}`);
        }}
      />
    </Box>
  );
};

export default EditDeleteButtons;
