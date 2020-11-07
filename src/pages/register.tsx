import React from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  useToast,
} from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation } from 'urql';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import SuccessToast from '../components/SuccessToast';
import { withApollo } from '../utils/withApollo';
interface Props {}

const Register: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const toast = useToast();

  return (
    <Wrapper variant="small" horizontalCenter>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { input: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
              cache.evict({ fieldName: 'posts:{}' });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            router.push('/');
            return toast({
              position: 'bottom-left',
              duration: 3000,
              render: ({ onClose }) => (
                <SuccessToast
                  onClose={onClose}
                  description="You've successfully registered and you are\n now signed in!"
                />
              ),
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading size="lg" fontWeight="light" mb={3}>
              Register
            </Heading>
            <Box my={3}>
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
                type="text"
                autoComplete="username"
              />
            </Box>
            <Box my={3}>
              <InputField
                name="email"
                placeholder="Email"
                label="Email"
                type="text"
                autoComplete="email"
              />
            </Box>
            <Box my={3}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={3}
              type="submit"
              variantColor="blue"
              w="100%"
            >
              Register
            </Button>
            <Flex>
              <Box
                mt={2}
                fontSize="md"
                w="100%"
                textAlign="center"
                color="gray.500"
              >
                Already have an account? click{' '}
                <NextLink href="/login">
                  <Link color="blue.500">here</Link>
                </NextLink>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
