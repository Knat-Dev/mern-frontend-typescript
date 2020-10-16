import { Flex, IconButton, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostsQuery,
  RegularCommentFragment,
  useVoteCommentMutation,
  useVoteMutation,
  VoteMutationVariables,
} from '../generated/graphql';

interface Props {
  post?: PostsQuery['posts']['posts'][0];
  comment?: RegularCommentFragment;
}

const VotingComponent: React.FC<Props> = ({ post, comment }) => {
  const [buttonsLoading, setButtonsLoading] = useState<
    'not-loading' | 'up-loading' | 'down-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();
  const [, voteComment] = useVoteCommentMutation();

  const voteUp = async () => {
    if (post?.voteStatus === 1) return;
    setButtonsLoading('up-loading');

    if (post) {
      await vote({ value: 1, postId: post.id });
    } else if (comment) {
      console.log('upvoting comment...');
      await voteComment({ value: 1, commentId: comment.id });
    }
    setButtonsLoading('not-loading');
  };

  const voteDown = async () => {
    if (post?.voteStatus === -1) return;
    setButtonsLoading('down-loading');
    if (post) {
      await vote({ value: -1, postId: post.id });
    } else if (comment) {
      await voteComment({ value: -1, commentId: comment.id });
    }
    setButtonsLoading('not-loading');
  };

  return (
    <Flex
      mr={5}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton
        icon="chevron-up"
        size={post ? 'sm' : 'xs'}
        aria-label="upvote post"
        variantColor={
          post?.voteStatus === 1
            ? 'blue'
            : comment?.voteStatus === 1
            ? 'blue'
            : undefined
        }
        onClick={voteUp}
        isLoading={buttonsLoading === 'up-loading'}
      />
      <Text display="inline" mx={1}>
        {post && post.points}
        {comment && comment.points}
      </Text>
      <IconButton
        icon="chevron-down"
        size={post ? 'sm' : 'xs'}
        aria-label="downvote post"
        variantColor={
          post?.voteStatus === -1
            ? 'blue'
            : comment?.voteStatus === -1
            ? 'blue'
            : undefined
        }
        onClick={voteDown}
        isLoading={buttonsLoading === 'down-loading'}
      />
    </Flex>
  );
};

export default VotingComponent;
