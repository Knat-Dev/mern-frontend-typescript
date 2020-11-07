import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Link,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { setAccessToken } from '../../utils/accessToken';
import { toErrorMap } from '../../utils/toErrorMap';

interface Props {}

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  const [changePassword] = useChangePasswordMutation();
  const token =
    typeof router.query.token === 'string' ? router.query.token : '';

  if (!token) router.replace('/');

  return (
    <Wrapper variant="small" horizontalCenter>
      <Formik
        initialValues={{ newPassword: '', token }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: { input: values },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap['token']);
            }
            return setErrors(errorMap);
          } else {
            setAccessToken(response.data?.changePassword.accessToken);
            return router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box my={3}>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
            </Box>

            <Button
              isLoading={isSubmitting}
              type="submit"
              variantColor="blue"
              w="100%"
            >
              Change Password
            </Button>
            {tokenError && (
              <Alert status="error" mt={3}>
                <AlertIcon />
                <AlertTitle mr={2}>Oops!</AlertTitle>
                <AlertDescription>
                  {tokenError},{' '}
                  <NextLink href="/forgot-password">
                    <Link>get another one!</Link>
                  </NextLink>
                </AlertDescription>
                <CloseButton
                  onClick={() => setTokenError('')}
                  position="absolute"
                  right="8px"
                  top="8px"
                />
              </Alert>
            )}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
