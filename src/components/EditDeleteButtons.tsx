import { Box, IconButton, useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PostQuery,
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from '../generated/graphql';
import SuccessToast from './SuccessToast';

interface Props {
  post: PostsQuery['posts']['posts'][0];
}

const EditDeleteButtons: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const { data } = useMeQuery();
  const [deletePost, { loading }] = useDeletePostMutation();
  const toast = useToast();

  return data?.me?.id !== post.creator.id ? null : (
    <Box>
      <IconButton
        mr={2}
        icon="delete"
        aria-label="Delete Post"
        variant="outline"
        isLoading={loading}
        onClick={async () => {
          await deletePost({ variables: { id: post.id } });
          if (router.pathname.includes('/post')) await router.push('/');
          return toast({
            position: 'bottom-left',
            duration: 3000,
            render: ({ onClose }) => (
              <SuccessToast
                onClose={onClose}
                description="Your post was successfully deleted!"
              />
            ),
          });
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
