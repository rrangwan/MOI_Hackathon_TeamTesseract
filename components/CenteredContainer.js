// components/CenteredContainer.js
import { Box } from "@chakra-ui/react";

const CenteredContainer = ({ children }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      backgroundColor="white"
    >
      <Box 
        width="7cm" // Fixed width of 7 cm
        height="15cm" // Fixed height of 15 cm
        backgroundColor="gray.100"
        borderRadius="md"
        boxShadow="lg"
        p={4}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CenteredContainer;
