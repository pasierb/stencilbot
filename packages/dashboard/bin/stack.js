#!/usr/bin/env node

const cdk = require('@aws-cdk/core')
const { StencilbotDashboardStack } = require('../lib/stack');

const app = new cdk.App();

new StencilbotDashboardStack(app, 'stancilbot-dashboard-stack', {
  env: {
    region: 'eu-west-1'
  }
});
