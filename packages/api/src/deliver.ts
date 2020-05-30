import path from 'path';
import { APIGatewayProxyHandler } from 'aws-lambda'
import { ServerRenderer } from './renderer';
import { createCanvas, Canvas, registerFont } from 'canvas';

const project = {
  width: 400,
  height: 400,
  layers: [
    {
      text: "hell",
      y: 0,
      imageUri: "https://i1.kwejk.pl/k/obrazki/2020/05/IaJcVc2s74kLam2l.jpg"
    },
    {
      text: "woot\nha!",
      y: 40
    },
    {
      text: "From 0x0",
      fontSize: 20,
      color: 'red',
      fontFamily: 'Roboto'
    }
  ]
};

const renderer = new ServerRenderer();

registerFont('fonts/Roboto-Regular.ttf', { family: 'Roboto' });

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {
  const { width, height, layers } = project;

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
