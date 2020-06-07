import path from 'path';
import { Stack, App, StackProps } from '@aws-cdk/core';
import { Runtime, Code, Function, LayerVersion } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';

export class StencilbotApiStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Delivery API
     */
    const nodeModulesLayer = new LayerVersion(this, 'stencilbot-deliver-modules', {
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      code: Code.fromAsset(path.join(__dirname, '../tmp/canvas.zip'))
    });

    const anounymousDeliveryFunction = new Function(this, 'stencil-delivery-anonymous', {
      code: Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'delivery/anonymous.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [nodeModulesLayer]
    });

    const anonymousDeliveryIntegration = new LambdaIntegration(anounymousDeliveryFunction);

    const deliveryApi = new RestApi(this, 'stencilbot-delivery-api', {
      binaryMediaTypes: ['image/png', '*/*']
    });

    const projectResource = deliveryApi.root.addResource('project');

    projectResource.addMethod('GET', anonymousDeliveryIntegration, {});
  }
}
