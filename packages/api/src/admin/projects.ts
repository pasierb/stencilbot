import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk';

import { Project } from '../models/project';

const dynamoDB = new DynamoDB();

const userId = '666';

const putProject: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body)
  const project = new Project({ ...body, userId });

  await project.save(dynamoDB);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project.toJSON())
  };
}

const getProject: APIGatewayProxyHandler = async (event) => {
  const project = await Project.find(dynamoDB, {
    id: event.pathParameters.id,
    userId
  });

  return {
    statusCode: project ? 200 : 404,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project && project.toJSON())
  };
}

export { getProject, putProject };
