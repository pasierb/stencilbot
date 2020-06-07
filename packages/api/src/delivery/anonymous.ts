import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda'
import { createCanvas, Canvas, registerFont } from 'canvas';
import { Layer, LayerInit } from '@stencilbot/renderer';
import { ServerRenderer } from '../serverRenderer';
import { registerDefaultFonts } from '../fonts';

interface ParseEventResult {
  width: number
  height: number
  layers: Layer[]
}

const renderer = new ServerRenderer();
const layerParamPattern = /^l\[(?<order>\d+)\](?<attr>\w+)$/;

function parseEvent(event: APIGatewayProxyEvent): ParseEventResult {
  const q = event.queryStringParameters;
  const width = +q['w']
  const height = +q['h']

  const layers = Object.entries(q).reduce<LayerInit[]>((acc, [key, value]) => {
    const match = key.match(layerParamPattern);

    if (match) {
      const order = +match.groups.order;
      const attr = match.groups.attr;
      const l: LayerInit = acc[order] || { order };

      l[attr] = value;
      acc[order] = l;
    }

    return acc;
  }, []).map(init => new Layer(init));

  return {
    width,
    height,
    layers
  };
}

registerDefaultFonts();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { width, height, layers } = parseEvent(event);
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
