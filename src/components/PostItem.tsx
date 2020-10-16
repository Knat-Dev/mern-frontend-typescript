import {
  Flex,
  Box,
  Heading,
  Link,
  Text,
  IconButton,
  Icon,
} from '@chakra-ui/core';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from '../generated/graphql';
import VotingComponent from './VotingComponent';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import EditDeleteButtons from './EditDeleteButtons';

interface Props {
  post: PostsQuery['posts']['posts'][0];
  isPostPage?: boolean;
}

const PostItem: React.FC<Props> = ({ post, isPostPage }) => {
  return (
    <Flex
      key={post.id}
      shadow="md"
      borderWidth="1px"
      alignItems={isPostPage ? 'start' : 'center'}
      p={3}
      mb={4}
    >
      <VotingComponent post={post} />
      <Box flex={1}>
        <Flex alignItems="center" minW={0}>
          <NextLink href={'/post/[id]'} as={`/post/${post.id}`}>
            <Link color="blue.500" maxW={['275px', '500px', '100%']}>
              <Flex maxW={['400px', '600px']}>
                <Heading
                  fontSize={'xl'}
                  isTruncated
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {post.title}
                </Heading>
              </Flex>
            </Link>
          </NextLink>
        </Flex>
        <Box fontSize={[14, 16]}>
          <Text as="span">
            posted by{' '}
            <Link as="span" color="blue.500">
              {post.creator.username}
            </Link>
          </Text>
          <Text as="span"> on </Text>
          <Text as="span" color="gray.500">
            {moment(post.createdAt).format('MMM Do, YYYY HH:mm')}
          </Text>
        </Box>

        <Flex mt={4} justifyContent="space-between" alignItems="center">
          {!isPostPage ? (
            <Flex maxW={['150px', '450px']}>
              <Text
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {post.textSnippet}
              </Text>
            </Flex>
          ) : (
            <Text
              as="pre"
              style={{
                wordBreak: 'break-all',
                whiteSpace: 'pre-wrap',
              }}
            >
              {post.text};
            </Text>
          )}
        </Flex>
        <Flex w="100%" mt={2} align="center" justify="space-between">
          <NextLink href={'/post/[id]'} as={`/post/${post.id}`}>
            <Link color="blue.500">
              <Box>
                <Icon name="chat" mr={2} />
                {post.commentCount}{' '}
                {post.commentCount !== 1 ? 'Comments' : 'Comment'}
              </Box>
            </Link>
          </NextLink>
          <Box color="gray.500">
            <EditDeleteButtons post={post} />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PostItem;
