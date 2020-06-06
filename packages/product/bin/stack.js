#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { StencilbotProductStack } = require('../lib/stack.js')

const app = new cdk.App();

new StencilbotProductStack(app, 'stencilbotProductStack', {
  env: {
    region: 'eu-west-1'
  }
});
