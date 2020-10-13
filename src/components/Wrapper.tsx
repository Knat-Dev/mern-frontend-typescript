import { Box, Flex } from '@chakra-ui/core';
import React from 'react';

interface Props {
  variant?: 'small' | 'regular';
  horizontalCenter?: boolean;
}

const Wrapper: React.FC<Props> = ({
  children,
  variant,
  horizontalCenter = false,
}) => {
  return horizontalCenter ? (
    <Flex height="calc(100vh - 72px)" alignItems="center">
      <Box
        maxWidth={variant === 'small' ? '400px' : '800px'}
        w="100%"
        mx="auto"
      >
        {children}
      </Box>
    </Flex>
  ) : (
    <Box
      mt={8}
      maxWidth={variant === 'small' ? '400px' : '800px'}
      w="100%"
      mx="auto"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
