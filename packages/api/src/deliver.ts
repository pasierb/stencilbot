import path from 'path';
import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk';
import { Project } from './models/project';
import { ServerRenderer } from './renderer';
import { createCanvas, Canvas, registerFont } from 'canvas';

const dynamoDB = new DynamoDB();
const renderer = new ServerRenderer();

registerFont(path.join(__dirname, 'fonts/Roboto-Regular.ttf'), { family: 'Roboto' });

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {
  const project = await Project.find(dynamoDB, {
    id: event.pathParameters.id,
    userId: event.pathParameters.userId
  })

  if (!project) {
    return {
      statusCode: 404,
      body: ''
    }
  }

  const { width, height } = project;
  const layers = await project.layers(dynamoDB);

  const base = createCanvas(width, height);
  const ctx = base.getContext('2d');

  const canvasLayers = await Promise.all(layers.map(layer => new Promise<Canvas>((resolve, reject) => {
    const canvas = createCanvas(width, height);

    renderer.render(canvas as unknown as HTMLCanvasElement, layer)
      .then(() => resolve(canvas))
      .catch(reject);
  })));

  canvasLayers.forEach((canvas) => {
    ctx.drawImage(canvas, 0, 0, width, height);
  });

  return {
    statusCode: 200,
    body: base.toBuffer().toString('base64'),
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'image/png'
    }
  };
}
