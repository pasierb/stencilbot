import React from 'react';
import { AppProps } from 'next/app'
import * as Sentry from '@sentry/browser';

import 'antd/dist/antd.css';
import '../index.css';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
}

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
