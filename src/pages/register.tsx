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
} from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
interface Props {}

const Register: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small" horizontalCenter>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ input: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            router.push('/');
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

export default withUrqlClient(createUrqlClient)(Register);
