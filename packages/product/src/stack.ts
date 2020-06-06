import { Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { Project, BuildSpec, Source, Artifacts, LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { CloudFrontWebDistribution, OriginAccessIdentity, CloudFrontAllowedMethods, ViewerCertificate } from '@aws-cdk/aws-cloudfront';

export class StencilbotProductStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const sourceBucket = new Bucket(this, 'stancilbot-product-source-bucket');

    const build = new Project(this, 'stencilbot-product-build', {
      buildSpec: BuildSpec.fromSourceFilename('buildspec.yml'),
      source: Source.gitHub({
        owner: 'pasierb',
        repo: 'stencilbot'
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_3_0,
      },
      artifacts: Artifacts.s3({
        bucket: sourceBucket,
        packageZip: false,
        encryption: false,
        includeBuildId: false,
        name: '.',
      })
    });

    const webDistribution = new CloudFrontWebDistribution(this, 'stencilbot-product-distribution', {
      originConfigs: [
        {
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS
            }
          ],
          s3OriginSource: {
            s3BucketSource: sourceBucket,
            originAccessIdentity: new OriginAccessIdentity(this, 'stencilbot-product-access-identity')
          }
        }
      ]
    });
  }
}