import { Box, Button, Flex, Heading, Link, useToast } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import Wrapper from './Wrapper';
import SuccessToast from './SuccessToast';

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const toast = useToast();

  let body: JSX.Element | null = null;

  if (fetching) body = null;
  else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else
    body = (
      <Flex alignItems="center">
        <NextLink href="/create-post">
          <Button as={Link} color="blue.500" size="sm">
            Create Post
          </Button>
        </NextLink>
        <Button
          isLoading={logoutFetching}
          variant="link"
          variantColor="#fff"
          mx={[2, 4]}
          onClick={async () => {
            const { error } = await logout();
            if (!error) {
              return toast({
                position: 'bottom-left',
                duration: 3000,
                render: ({ onClose }) => (
                  <SuccessToast
                    onClose={onClose}
                    description="You've successfully logged out!"
                  />
                ),
              });
            }
          }}
          size="sm"
        >
          Logout
        </Button>
        <Box>Hi {data.me.username}!</Box>
      </Flex>
    );

  return (
    <Flex
      h="72px"
      bg="#2a69ac"
      color="white"
      p={4}
      position="sticky"
      top={0}
      zIndex={1}
      alignItems="center"
    >
      <Flex
        maxWidth={800}
        m="auto"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <NextLink href="/">
          <Link>
            <Heading size="lg">Reddit-ish</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
