import path from 'path';
import { Stack, Duration } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source, CacheControl } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, CloudFrontAllowedMethods, OriginAccessIdentity, ViewerProtocolPolicy, OriginProtocolPolicy } from '@aws-cdk/aws-cloudfront';

const certificateArn = 'arn:aws:acm:us-east-1:112135394201:certificate/00212b82-36e1-4411-b722-ec445048fd07';

export class StencilbotDashboardStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'dashboard-static', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true
    })

    new BucketDeployment(this, 'dashboard-static-deployment', {
      destinationBucket: bucket,
      sources: [
        Source.asset(path.join(__dirname, '../out'))
      ],
      cacheControl: [
        CacheControl.maxAge(Duration.days(30))
      ]
    });

    new CloudFrontWebDistribution(this, 'web-distribution', {
      originConfigs: [
        {
          customOriginSource: {
            domainName: bucket.bucketWebsiteDomainName,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
          },
          behaviors: [
            {
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,

              isDefaultBehavior: true,
              forwardedValues: {
                queryString: true
              }
            }
          ]
        }
      ],
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 404,
          responsePagePath: '/404.html'
        }
      ],
      aliasConfiguration: {
        names: [
          'stencilbot.io',
          'www.stencilbot.io'
        ],
        acmCertRef: certificateArn
      }
    })
  }
}
