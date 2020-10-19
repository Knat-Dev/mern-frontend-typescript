import {
  Box,
  Flex,
  Link,
  Button,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link';
import { useForgotPasswordMutation } from '../generated/graphql';
import { Router } from 'next/router';
import { withApollo } from '../utils/withApollo';

interface Props {}

const ForgotPassword: React.FC<Props> = (props) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [successAlert, setSuccessAlert] = useState(false);

  return (
    <Wrapper variant="small" horizontalCenter>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword({ variables: values });
          setSuccessAlert(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* <Box mb={4} fontSize="lg" fontWeight="bold">
                                Forgot Password
                            </Box> */}

            {successAlert ? (
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                justifyContent="center"
                textAlign="center"
                height="200px"
                mt={3}
              >
                <AlertIcon size="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="xl">
                  Horray!
                </AlertTitle>
                <AlertDescription maxWidth="md">
                  if an account with that email address exists, we sent you an
                  email.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Box my={3}>
                  <InputField
                    name="email"
                    placeholder="Email"
                    label="Email"
                    type="email"
                  />
                </Box>

                <Button
                  isLoading={isSubmitting}
                  mt={3}
                  type="submit"
                  variantColor="blue"
                  w="100%"
                >
                  Send Email
                </Button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
