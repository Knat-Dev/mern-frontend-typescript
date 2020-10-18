import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import theme from '../theme';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
