#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { StencilbotProductStack, StencilbotDomainStack } = require('../lib/stack.js')

const app = new cdk.App();

new StencilbotDomainStack(app, 'stencilbotDomainStack', {
  env: {
    account: 112135394201,
    region: 'us-east-1'
  }
})

// new StencilbotProductStack(app, 'stencilbotProductStack', {
//   env: {
//     region: 'eu-west-1'
//   }
// });
