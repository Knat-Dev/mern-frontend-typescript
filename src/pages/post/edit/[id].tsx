import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

interface Props {}

const EditPost: React.FC<Props> = () => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [, updatePost] = useUpdatePostMutation();
  const [{ data, error, fetching }] = usePostQuery({
    pause: id === '',
    variables: {
      id,
    },
  });

  if (fetching || !data?.post)
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );

  if (error) return <div>{error.message}</div>;

  return (
    <Layout variant="small" horizontalCenter>
      <Formik
        initialValues={{ id, title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await updatePost(values);
          if (!error) {
            router.back();
          }
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

export default withUrqlClient(createUrqlClient)(EditPost);
