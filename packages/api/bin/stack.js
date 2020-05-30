#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CardStampApiStack } = require('../lib/stack.js')

const app = new cdk.App();

new CardStampApiStack(app, 'CardStampApiStack', {
  env: {
    region: 'eu-west-1'
  }
});
