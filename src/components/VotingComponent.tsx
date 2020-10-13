import { Flex, IconButton, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostsQuery,
  useVoteMutation,
  VoteMutationVariables,
} from '../generated/graphql';

interface Props {
  post: PostsQuery['posts']['posts'][0];
}

const VotingComponent: React.FC<Props> = ({ post }) => {
  const [buttonsLoading, setButtonsLoading] = useState<
    'not-loading' | 'up-loading' | 'down-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();

  const voteUp = async () => {
    if (post.voteStatus === 1) return;
    setButtonsLoading('up-loading');
    await vote({ value: 1, postId: post.id });
    setButtonsLoading('not-loading');
  };

  const voteDown = async () => {
    if (post.voteStatus === -1) return;
    setButtonsLoading('down-loading');
    await vote({ value: -1, postId: post.id });
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
        size="xs"
        aria-label="upvote post"
        variantColor={post.voteStatus === 1 ? 'blue' : undefined}
        onClick={voteUp}
        isLoading={buttonsLoading === 'up-loading'}
      />
      <Text display="inline" mx={1}>
        {post.points}
      </Text>
      <IconButton
        icon="chevron-down"
        size="xs"
        aria-label="downvote post"
        variantColor={post.voteStatus === -1 ? 'blue' : undefined}
        onClick={voteDown}
        isLoading={buttonsLoading === 'down-loading'}
      />
    </Flex>
  );
};

export default VotingComponent;
