import App from 'next/app';
import React from 'react';
import withApolloClient from '../lib/with-apollo-client';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';

type MyAppProps = {
  apolloClient: ApolloClient<object>,
};

class MyApp extends App<MyAppProps> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApolloClient(MyApp);
