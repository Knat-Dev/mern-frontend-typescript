import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from 'next/link';
import SuccessToast from '../components/SuccessToast';

interface Props {}

const Login: React.FC<Props> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();
  const toast = useToast();

  return (
    <Wrapper horizontalCenter variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: { input: values },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            if (typeof router.query.next === 'string')
              router.push(router.query.next);
            else router.push('/');
            return toast({
              position: 'bottom-left',
              duration: 3000,
              render: ({ onClose }) => (
                <SuccessToast
                  onClose={onClose}
                  description="You've successfully signed in!"
                />
              ),
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading size="lg" fontWeight="light" mb={3}>
              Login
            </Heading>
            <Box my={3}>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or Email"
                label="Username or Email"
                type="text"
                autoComplete="email"
              />
            </Box>
            <Box mt={3}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex>
              <Box
                mt={1}
                fontSize="sm"
                w="100%"
                textAlign="right"
                color="gray.500"
              >
                Forgot password? click{' '}
                <NextLink href="/forgot-password">
                  <Link color="blue.500">here</Link>
                </NextLink>
              </Box>
            </Flex>
            <Button
              isLoading={isSubmitting}
              mt={3}
              type="submit"
              variantColor="blue"
              w="100%"
            >
              Login
            </Button>
            <Flex>
              <Box
                mt={2}
                fontSize="md"
                w="100%"
                textAlign="center"
                color="gray.500"
              >
                Don't have an account? click{' '}
                <NextLink href="/register">
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

export default Login;
