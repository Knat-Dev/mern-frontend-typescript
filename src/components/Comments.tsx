import { Flex, Heading, List, ListItem, Text } from '@chakra-ui/core';
import moment from 'moment';
import React from 'react';
import { RegularCommentFragment } from '../generated/graphql';
import CreateComment from './CreateComment';
import VotingComponent from './VotingComponent';

interface Props {
  postId: string;
  comments: RegularCommentFragment[];
  fetchMore: () => void;
}

const Comments: React.FC<Props> = ({ comments, postId, fetchMore }) => {
  return (
    <>
      <CreateComment postId={postId} fetchMore={fetchMore} />
      {comments.length > 0 && (
        <Heading fontWeight="medium" size="lg" mb={4}>
          Comments
        </Heading>
      )}
      <List spacing={4}>
        {comments.length > 0 &&
          comments.map((comment) =>
            !comment ? null : (
              <ListItem key={comment.id}>
                <Flex
                  shadow="md"
                  borderWidth="1px"
                  alignItems="center"
                  p={3}
                  mb={4}
                >
                  <VotingComponent comment={comment} />
                  <Flex flexDir="column">
                    <Text>{comment.text}</Text>
                    <Text color="gray.500">
                      comment by {comment.creator.username} on{' '}
                      {moment(new Date(comment.createdAt)).format(
                        'MMM Do, YYYY HH:mm'
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </ListItem>
            )
          )}
      </List>
    </>
  );
};

export default Comments;
