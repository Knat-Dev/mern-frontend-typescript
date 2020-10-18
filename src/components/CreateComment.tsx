import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useToast,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PaginationInput,
  useCreateCommentMutation,
  useMeQuery,
} from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import SuccessToast from './SuccessToast';

interface Props {
  postId: string;
  setInput: (input: PaginationInput) => void;
  input: PaginationInput;
}

const CreateComment: React.FC<Props> = ({ postId, setInput, input }) => {
  const toast = useToast();
  const [createComment] = useCreateCommentMutation();
  const { data: meData, loading } = useMeQuery();
  const router = useRouter();

  return (
    <Formik
      initialValues={{ text: '', postId }}
      onSubmit={async (values, form) => {
        if (!meData?.me && !loading) {
          router.replace('/login?next=' + `/post/${postId}`);
        }
        if (input.cursor !== null && values.text.length >= 2)
          setInput({ cursor: null, limit: 4 });

        const { data, errors } = await createComment({ variables: values });
        form.resetForm({});

        if (data?.createComment.errors) {
          form.setErrors(toErrorMap(data.createComment.errors));
        } else if (!errors) {
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
