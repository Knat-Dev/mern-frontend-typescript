import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import {
  RegularCommentFragmentDoc,
  useCreateCommentMutation,
  useMeQuery,
} from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import SuccessToast from './SuccessToast';

interface Props {
  postId: string;
  fetchMore: () => void;
}

const CreateComment: React.FC<Props> = ({ postId, fetchMore }) => {
  const toast = useToast();
  const [createComment] = useCreateCommentMutation({});
  const { data: meData, loading } = useMeQuery();
  const router = useRouter();

  return (
    <Formik
      initialValues={{ text: '', postId }}
      onSubmit={async (values, form) => {
        if (!meData?.me && !loading) {
          router.replace('/login?next=' + `/post/${postId}`);
        }

        const { data, errors } = await createComment({
          variables: values,
          update: (cache, { data }) => {
            cache.modify({
              fields: {
                comments(existingComments = []) {
                  const addedComment = data?.createComment.comment;

                  const doc = cache.writeFragment({
                    fragment: RegularCommentFragmentDoc,
                    data: addedComment,
                  });

                  return {
                    ...existingComments,
                    comments: [doc, ...existingComments.comments],
                  };
                },
                post(existingComments = []) {
                  console.log(existingComments, data);
                  // return { ...existingComments };
                },
              },
            });
          },
          //   console.log(data);
          //   cache.modify({
          //     fields: {
          //       comments(existingComments = []) {
          //         console.log(existingComments);
          //         const newCommentRef = cache.writeFragment({
          //           data: data?.createComment.comment,
          //           fragment: gql`
          //             fragment NewComment on Comment {
          //               id
          //             }
          //           `,
          //         });
          //         // cache.evict({ fieldName: 'Post:' + postId });
          //         console.log('hi', [
          //           newCommentRef,
          //           ...existingComments.comments,
          //         ]);

          //         form.resetForm({});
          //         toast({
          //           position: 'bottom-left',
          //           duration: 3000,
          //           render: ({ onClose }) => (
          //             <SuccessToast
          //               onClose={onClose}
          //               description="You've successfully commented on a post"
          //             />
          //           ),
          //         });
          //         return {
          //           __typeName: 'PaginatedComments',
          //           comments: [newCommentRef],
          //           hasMore: false,
          //         };
          //       },
          //     },
          //   });
          // },
        });
        form.resetForm({});

        if (data?.createComment.errors) {
          form.setErrors(toErrorMap(data.createComment.errors));
        } else if (!errors) {
          // fetchMore();
          return toast({
            position: 'bottom-left',
            duration: 3000,
            render: ({ onClose }) => (
              <SuccessToast
                onClose={onClose}
                description="You've successfully commented on a post"
              />
            ),
          });
        }
      }}
    >
      {({ isSubmitting, handleChange, values, errors }) => (
        <Form>
          <FormControl isInvalid={!!errors.text} mb={8}>
            <InputGroup size="md">
              <Input
                value={values.text}
                onChange={handleChange}
                pr="4.5rem"
                placeholder="Type comment..."
                name="text"
                type="text"
                autoComplete="off"
              />
              <InputRightElement width="8.5rem">
                <Button
                  isLoading={isSubmitting}
                  variantColor="blue"
                  type="submit"
                  h="1.65rem"
                  size="sm"
                >
                  Send Comment
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.text && <FormErrorMessage>{errors.text}</FormErrorMessage>}
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default CreateComment;
