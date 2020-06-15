import path from 'path';
import { Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

export class StencilbotDashboardStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'stencilbot-dashboard-static', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html'
    });

    new BucketDeployment(this, 'stencilbot-dashboard-static-deployment', {
      destinationBucket: bucket,
      sources: [
        Source.asset(path.join(__dirname, '../out'))
      ]
    })
  }
}
