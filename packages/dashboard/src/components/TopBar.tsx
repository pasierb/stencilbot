import React from 'react';
import { Link } from '@reach/router';
import { Layout } from 'antd';

export const TopBar = () => {


  return (
    <Layout.Header>
      <Link to="/">Stencilbot</Link>
    </Layout.Header>
  );
}
