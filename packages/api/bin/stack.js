#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { stencilbotApiStack } = require('../lib/stack.js')

const app = new cdk.App();

new stencilbotApiStack(app, 'stencilbotApiStack', {
  env: {
    region: 'eu-west-1'
  }
});
