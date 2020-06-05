import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk';
import { Layer } from '../models/layer';

const dynamoDB = new DynamoDB();

const listLayers: APIGatewayProxyHandler = async (event) => {
  const layers = await Layer.forProject(dynamoDB, event.pathParameters.projectId);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(layers.map(l => l.toJSON()))
  }
}

const putLayer: APIGatewayProxyHandler = async (event) => {
  const { projectId } = event.pathParameters;
  const body = JSON.parse(event.body);

  const layer = new Layer({ ...body, projectId });

  await layer.save(dynamoDB);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(layer.toJSON())
  }
}

export { listLayers, putLayer };
