import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import theme from '../theme';
import { withApollo } from '../utils/ApolloClient';

function MyApp({ Component, pageProps, apolloClient }: any) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default withApollo(MyApp);
