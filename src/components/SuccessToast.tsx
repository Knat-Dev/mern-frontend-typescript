import { CloseButton, Flex, Heading, Icon, Text } from '@chakra-ui/core';
import React from 'react';

interface Props {
  onClose: () => void;
  description: string;
}

const SuccessToast: React.FC<Props> = ({ onClose, description }) => {
  return (
    <Flex
      alignItems="start"
      m={3}
      p={3}
      boxShadow={
        '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)'
      }
      bg="gray.100"
      borderRadius="0.25rem"
      borderLeft="4px solid"
      borderLeftColor="green.500"
      position="relative"
      overflow="hidden"
    >
      <Icon name="check-circle" color="green.500" size="1.25rem" mr={4} />
      <Flex flexDirection="column">
        <Heading size="sm">Success!</Heading>
        <Text>{description}</Text>
      </Flex>
      <CloseButton
        size="sm"
        position="absolute"
        right="4px"
        top="4px"
        onClick={onClose}
      />
    </Flex>
  );
};

export default SuccessToast;
