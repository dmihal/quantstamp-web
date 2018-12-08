import React from 'react';
import App, { Container } from 'next/app';
import Wrappers from '../components/Wrappers';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render () {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Wrappers>
          <Component {...pageProps} />
        </Wrappers>
      </Container>
    )
  }
}
