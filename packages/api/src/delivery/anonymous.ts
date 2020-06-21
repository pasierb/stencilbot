import { APIGatewayProxyHandler } from 'aws-lambda'
import { Project } from '@stencilbot/renderer';
import Sentry from '@sentry/node';
import { ServerRenderer } from '../serverRenderer';

const renderer = new ServerRenderer();

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const project = Project.fromSearchParams(event.queryStringParameters);
    const base = await renderer.renderProject(project);

    return {
      statusCode: 200,
      body: base.toBuffer().toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=31536000'
      }
    };
  } catch(e) {
    Sentry.captureException(e, {
      extra: {
        queryStringParameters: event.queryStringParameters
      }
    });
    await Sentry.flush(2000);

    throw e;
  }
}
