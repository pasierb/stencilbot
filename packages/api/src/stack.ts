import path from 'path';
import { Stack, App, StackProps, Duration } from '@aws-cdk/core';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { Runtime, Code, Function, LayerVersion } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi, EndpointType, DomainName } from '@aws-cdk/aws-apigateway';
import { Bucket } from '@aws-cdk/aws-s3';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { CloudFrontAllowedMethods, CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

interface StencilbotApiStackProps extends StackProps {
  googleFontsApiKey: string
}
export class StencilbotApiStack extends Stack {
  constructor(scope: App, id: string, props: StencilbotApiStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'stencilbot-delivery-bucket');

    const certificate = Certificate.fromCertificateArn(this, 'stencilbot-certificate', 'arn:aws:acm:us-east-1:112135394201:certificate/00212b82-36e1-4411-b722-ec445048fd07');

    const nodeModulesLayer = new LayerVersion(this, 'stencilbot-deliver-modules', {
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      code: Code.fromAsset(path.join(__dirname, '../tmp/canvas.zip'))
    });

    const anounymousDeliveryFunction = new Function(this, 'stencil-delivery-anonymous', {
      code: Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'delivery/anonymous.handler',
      environment: {
        GOOGLE_FONTS_API_KEY: props.googleFontsApiKey,
        BUCKET: bucket.bucketName
      },
      runtime: Runtime.NODEJS_12_X,
      layers: [nodeModulesLayer],
      timeout: Duration.seconds(5)
    });

    anounymousDeliveryFunction.addToRolePolicy(new PolicyStatement({
      resources: [
        bucket.bucketArn,
        `${bucket.bucketArn}/*`
      ],
      actions: ['s3:*']
    }));

    const anonymousDeliveryIntegration = new LambdaIntegration(anounymousDeliveryFunction);

    const deliveryApi = new RestApi(this, 'stencilbot-delivery-api', {
      binaryMediaTypes: ['image/png', '*/*']
    });

    const projectResource = deliveryApi.root.addResource('project');

    projectResource.addMethod('GET', anonymousDeliveryIntegration, {});
  }
}
