#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { StencilbotApiStack } = require('../lib/stack.js')

const app = new cdk.App();

new StencilbotApiStack(app, 'stencilbotApiStack', {
  env: {
    region: 'eu-west-1'
  },
  googleFontsApiKey: process.env.GOOGLE_FONTS_API_KEY
});
