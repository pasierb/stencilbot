import { APIGatewayProxyHandler } from "aws-lambda";
import { URLSearchParams } from 'url';
import { Project } from '@stencilbot/renderer';
import { ServerRenderer } from '../serverRenderer';
import { templates } from '@stencilbot/templates';

const renderer = new ServerRenderer();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { templateId } = event.pathParameters;
    const t = templates[templateId];

    if (!t) {
      return {
        statusCode: 404,
        body: ''
      }
    }

    const searchParams = new URLSearchParams(t.query);
    for (let entry of Object.entries(event.queryStringParameters)) {
      searchParams.set(...entry);
    }

    const params = [...searchParams.entries()].reduce((acc, [key, value]) => {
      const k = t.variables[key] || key;

      return {
        ...acc,
        [k]: value
      };
    }, {});

    const project = Project.fromSearchParams(params);
    const base = await renderer.renderProject(project);

    return {
      statusCode: 200,
      body: base.toBuffer().toString('base64'),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=31536000'
      }
    }
  } catch(e) {
    return {
      statusCode: 500,
      body: e
    }
  }
}
