import { URL } from "url";
import { Project } from '@stencilbot/renderer'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { FontProvider } from './FontProvider';
import { ImageProvider } from "./ImageProvider";
import { ServerRenderer } from './ServerRenderer';
import { ProjectStore } from "./ProjectStore";

interface Handler {
  handle: APIGatewayProxyHandler
}

interface StoreConfig {
  store: ProjectStore;
  domain: string;
}

export class ProjectHandler implements Handler {
  constructor(
    readonly fontProvider: FontProvider,
    readonly imageProvider: ImageProvider,
    readonly storeConfig?: StoreConfig
  ) {}

  handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const project = Project.fromSearchParams(event.queryStringParameters || {});
    const renderer = new ServerRenderer(project, this.fontProvider, this.imageProvider);

    if (this.storeConfig) {
      return this.handleStore(renderer);
    } else {
      return this.handleRender(renderer);
    }
  }

  private async handleStore(renderer: ServerRenderer): Promise<APIGatewayProxyResult> {
    if (!this.storeConfig) {
      throw new Error("No store configuration found");
    }

    const key = await this.storeConfig.store.save(renderer);
    const url = new URL(key, `https://${this.storeConfig.domain}`);

    return {
      statusCode: 301,
      body: "",
      headers: {
        "Location": url.href
      }
    }
  }

  private async handleRender(renderer: ServerRenderer): Promise<APIGatewayProxyResult> {
    await renderer.render();

    return {
      statusCode: 301,
      body: renderer.base.toBuffer().toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': "public, max-age=2592000, immutable"
      }
    };
  }
}
