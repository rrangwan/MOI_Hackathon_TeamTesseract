// _app.js
import { ChakraProvider } from "@chakra-ui/react";
import '../styles/globals.css'; // Importing global CSS

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
