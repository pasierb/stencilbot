import { APIGatewayProxyHandler } from "aws-lambda";
import { URLSearchParams } from 'url';
import { Project } from '@stencilbot/renderer';
import { ServerRenderer } from '../serverRenderer';

const renderer = new ServerRenderer();

type TemplateData = {
  query: string
  alias: {[key: string]: string}
}

const templates: {[key: string]: TemplateData} = {
  '1': {
    'query': 'w=400&h=387&0.img=https%3A%2F%2Fimgflip.com%2Fs%2Fmeme%2FBatman-Slapping-Robin.jpg&1.x=10&1.y=5&1.w=180&1.h=71&1.txt=this%20%20meme%20is%20overused!!!&1.fontSize=20&1.font=Comic%20Neue%3A700&1.txtAlign=center&1.valign=middle&2.x=220&2.y=5&2.w=171&2.h=77&2.txt=NEVER!&2.fontSize=20&2.font=Comic%20Neue%3A700&2.txtAlign=center&2.valign=middle',
    'alias': {
      'robin': '1.txt',
      'batman': '2.txt'
    }
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { templateId } = event.pathParameters;
    const t = templates[templateId];
    const searchParams = new URLSearchParams(t.query);

    for (let entry of Object.entries(event.queryStringParameters)) {
      searchParams.set(...entry);
    }

    const params = [...searchParams.entries()].reduce((acc, [key, value]) => {
      let k = t.alias[key] || key;

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
    console.error(e);
    throw e
  }
}
