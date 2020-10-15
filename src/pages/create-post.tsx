import { Box, Button, Heading, useToast } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import SuccessToast from '../components/SuccessToast';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';
import forgotPassword from './forgot-password';

const CreatePost = () => {
  useIsAuth();
  const toast = useToast();

  const router = useRouter();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant="small" horizontalCenter>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({ input: values });
          if (
            !response.data?.createPost?.errors &&
            !response.error &&
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

export default withUrqlClient(createUrqlClient)(CreatePost);
