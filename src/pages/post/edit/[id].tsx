import { Box, Button, Spinner, useToast } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import SuccessToast from '../../../components/SuccessToast';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { toErrorMap } from '../../../utils/toErrorMap';

interface Props {}

const EditPost: React.FC<Props> = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [updatePost] = useUpdatePostMutation();
  const [input, setInput] = useState({
    limit: 4,
    cursor: null as null | number | undefined,
  });

  const { data, error, loading } = usePostQuery({
    skip: id === '',
    variables: {
      id,
      input,
    },
  });
  const toast = useToast();

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

  if (error) return <div>{error.message}</div>;

  return (
    <Layout variant="small" horizontalCenter>
      <Formik
        initialValues={{ id, title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          const response = await updatePost({ variables: values });
          if (
            !response.data?.updatePost?.errors &&
            !response.errors &&
            response.data?.updatePost?.post
          ) {
            await router.push('/');
            return toast({
              position: 'bottom-left',
              duration: 3000,
              render: ({ onClose }) => (
                <SuccessToast
                  onClose={onClose}
                  description="Your post was edited successfully!"
                />
              ),
            });
          } else if (response.data?.updatePost?.errors)
            return setErrors(toErrorMap(response.data?.updatePost.errors));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box my={3}>
              <InputField
                name="title"
                placeholder="Title"
                label="Title"
                type="text"
              />
            </Box>
            <Box my={3}>
              <InputField
                name="text"
                placeholder="Text"
                label="Text"
                type="text"
                variant="textarea"
              />
            </Box>

            <Button
              isLoading={isSubmitting}
              mt={3}
              type="submit"
              variantColor="blue"
              w="100%"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
