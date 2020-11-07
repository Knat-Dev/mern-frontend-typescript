import { Box, Button, Heading, useToast } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import SuccessToast from '../components/SuccessToast';
import { useCreatePostMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost = () => {
  useIsAuth();
  const toast = useToast();

  const router = useRouter();
  const [createPost] = useCreatePostMutation();

  return (
    <Layout variant="small" horizontalCenter>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts' });
            },
          });
          if (
            !response.data?.createPost?.errors &&
            !response.errors &&
            response.data?.createPost?.post
          ) {
            await router.push('/');
            return toast({
              position: 'bottom-left',
              duration: 3000,
              render: ({ onClose }) => (
                <SuccessToast
                  onClose={onClose}
                  description="Your post was created successfully!"
                />
              ),
            });
          } else if (response.data?.createPost?.errors)
            return setErrors(toErrorMap(response.data?.createPost.errors));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading size="md" fontWeight="light">
              Create post:
            </Heading>
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
              Submit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
