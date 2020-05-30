import path from 'path';
import { Stack } from '@aws-cdk/core';
import { Runtime, Code, Function, LayerVersion } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
export class CardStampApiStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const nodeModulesLayer = new LayerVersion(this, 'cardstamp-deliver-modules', {
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      code: Code.fromAsset(path.join(__dirname, '../tmp/canvas.zip'))
    });

    const deliveryFunction = new Function(this, 'cardstamp-delivery', {
      code: Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'deliver.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [nodeModulesLayer]
    });

    const deliveryIntegration = new LambdaIntegration(deliveryFunction);

    const deliveryApi = new RestApi(this, 'cardstamp-delivery-api', {
      binaryMediaTypes: ['image/png', '*/*']
    });

    const projectsResource = deliveryApi.root.addResource('projects');

    projectsResource.addMethod('GET', deliveryIntegration);
  }
}
