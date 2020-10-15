import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Grid,
  Heading,
  Spinner,
} from '@chakra-ui/core';
import moment from 'moment';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import EditDeleteButtons from '../../components/EditDeleteButtons';
import Layout from '../../components/Layout';
import { PostsQuery, useMeQuery, usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

interface Props {
  post: PostsQuery['posts']['posts'][0];
}

const Post: React.FC<Props> = ({ post }) => {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [{ data, error, fetching }] = usePostQuery({
    pause: id === '',
    variables: {
      id,
    },
  });

  if (fetching || !data?.post)
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

  if (error?.message) return <div>{error.message}</div>;

  if (!data?.post)
    return (
      <Layout>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          height="150px"
        >
          <AlertIcon size="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Post could not be found!
          </AlertTitle>
        </Alert>
      </Layout>
    );

  return (
    <Layout>
      <Box p={['10px', '10px', 0]}>
        <Grid
          justifyContent="center"
          alignItems="baseline"
          justifyItems="center"
          templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
          mb={8}
        >
          <Heading wordBreak="break-all" fontWeight="medium">
            {data.post.title}
          </Heading>
          <Box color="gray.500">
            created by {data.post.creator.username} on{' '}
            {moment(data.post.createdAt).format('MMM Mo, YYYY HH:mm')}
          </Box>
        </Grid>
        <Box minHeight={400} whiteSpace="pre">
          {data.post.text}
        </Box>
        <EditDeleteButtons post={data.post} />
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
