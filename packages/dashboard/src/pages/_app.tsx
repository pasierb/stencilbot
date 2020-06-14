import React from 'react';
import { AppProps } from 'next/app'

import 'antd/dist/antd.css';
import '../index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
