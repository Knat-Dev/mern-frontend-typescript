import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  useToast,
} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import {
  CommentResponse,
  PaginationInput,
  PostQuery,
  RegularCommentFragment,
  useCreateCommentMutation,
} from '../generated/graphql';
import login from '../pages/login';
import { toErrorMap } from '../utils/toErrorMap';
import CreateComment from './CreateComment';
import SuccessToast from './SuccessToast';
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
