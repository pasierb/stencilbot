import { Project } from '@stencilbot/renderer'
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { FontProvider } from './FontProvider';
import { ImageProvider } from "./ImageProvider";
import { ServerRenderer } from './ServerRenderer';

interface Handler {
  handle: APIGatewayProxyHandler
}

export class ProjectHandler implements Handler {
  constructor(readonly fontProvider: FontProvider, readonly imageProvider: ImageProvider) {}

  async handle(event: APIGatewayProxyEvent) {
    const project = Project.fromSearchParams(event.queryStringParameters);
    const renderer = new ServerRenderer(project, this.fontProvider, this.imageProvider);

    await renderer.render()

    return {
      statusCode: 200,
      body: renderer.base.toBuffer().toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=31536000'
      }
    }
  }
}
