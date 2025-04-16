import React from 'react';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';

const TestChakra = () => {
    return (
        <ChakraProvider>
            <Box p={4} bg="blue.600" color="white">
                <Text fontSize="2xl">Hello, Chakra UI!</Text>
            </Box>
        </ChakraProvider>
    );
};

export default TestChakra;
