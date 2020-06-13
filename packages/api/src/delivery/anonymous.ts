import { APIGatewayProxyHandler } from 'aws-lambda'
import { Project } from '@stencilbot/renderer';
import { ServerRenderer } from '../serverRenderer';
import { registerDefaultFonts } from '../fonts';

const renderer = new ServerRenderer();

registerDefaultFonts();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event.queryStringParameters);

  const project = Project.fromSearchParams(event.queryStringParameters);
  const base = await renderer.renderProject(project);

  console.log({ project });

  return {
    statusCode: 200,
    body: base.toBuffer().toString('base64'),
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'image/png'
    }
  };
}
