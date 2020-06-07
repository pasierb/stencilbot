import path from 'path';
import { Stack, App, StackProps, RemovalPolicy } from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Runtime, Code, Function, LayerVersion } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { HttpApi, HttpMethod, LambdaProxyIntegration, CfnAuthorizer } from '@aws-cdk/aws-apigatewayv2';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';

export class StencilbotApiStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Persistency
     */

    const projectsTable = new Table(this, 'stencilbot-projects-table', {
      tableName: 'StencilbotProjects',
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const layersTable = new Table(this, 'stencilbot-project-layers-table', {
      tableName: 'StencilbotProjectLayers',
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'projectId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    /**
     * Delivery API
     */

    const nodeModulesLayer = new LayerVersion(this, 'stencilbot-deliver-modules', {
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      code: Code.fromAsset(path.join(__dirname, '../tmp/canvas.zip'))
    });

    const projectDeliveryFunction = new Function(this, 'stencilbot-delivery', {
      code: Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'delivery/project.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [nodeModulesLayer]
    });

    const anounymousDeliveryFunction = new Function(this, 'stencil-delivery-anonymous', {
      code: Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'delivery/anonymous.handler',
      runtime: Runtime.NODEJS_12_X,
      layers: [nodeModulesLayer]
    });

    projectDeliveryFunction.addToRolePolicy(new PolicyStatement({
      actions: [
        "dynamodb:Get*",
        "dynamodb:BatchGet*",
        "dynamodb:Query"
      ],
      resources: [
        projectsTable.tableArn,
        layersTable.tableArn
      ]
    }));

    const projectDeliveryIntegration = new LambdaIntegration(projectDeliveryFunction);
    const anonymousDeliveryIntegration = new LambdaIntegration(anounymousDeliveryFunction);

    const deliveryApi = new RestApi(this, 'stencilbot-delivery-api', {
      binaryMediaTypes: ['image/png', '*/*']
    });

    const usersResource = deliveryApi.root.addResource('users');
    const userResource = usersResource.addResource('{userId}');
    const userProjectsResource = userResource.addResource('projects');
    const userProjectResource = userProjectsResource.addResource('{id}');

    userProjectResource.addMethod('GET', projectDeliveryIntegration, {
      requestParameters: {
        'method.request.path.id': true
      }
    });

    const projectResource = deliveryApi.root.addResource('project');

    projectResource.addMethod('GET', anonymousDeliveryIntegration, {});

    /**
     * Admin API
     */

    const adminApi = new HttpApi(this, 'stencilbot-admin-api', {
      apiName: 'stencilbot-admin-api'
    });

    const auth0Authorizer = new CfnAuthorizer(this, 'stencilbot-api-auth0-authorizer', {
      apiId: adminApi.httpApiId,
      authorizerType: 'JWT',
      identitySource: ['$request.header.Authorization'],
      name: 'auth0',
      jwtConfiguration: {
        issuer: 'https://dev-0c12sn7n.eu.auth0.com/',
        audience: ['urn:stencilbot-admin']
      }
    })

    const getProjectFunction = new NodejsFunction(this, 'stencilbot-admin-api-get-project-fn', {
      entry: path.join(__dirname, '../src/admin/projects.ts'),
      handler: 'getProject'
    });

    const putProjectFunction = new NodejsFunction(this, 'stencilbot-admin-api-put-project-fn', {
      entry: path.join(__dirname, '../src/admin/projects.ts'),
      handler: 'putProject'
    });

    const listLayersFunction = new NodejsFunction(this, 'stencilbot-admin-api-get-layers-fn', {
      entry: path.join(__dirname, '../src/admin/layers.ts'),
      handler: 'listLayers'
    });

    const putLayerFunction = new NodejsFunction(this, 'stencilbot-admin-api-put-layer-fn', {
      entry: path.join(__dirname, '../src/admin/layers.ts'),
      handler: 'putLayer'
    });

    [
      getProjectFunction,
      putProjectFunction,
      listLayersFunction,
      putLayerFunction
    ].forEach(fn => {
      fn.addToRolePolicy(new PolicyStatement({
        actions: ["dynamodb:*"],
        resources: [
          projectsTable.tableArn,
          layersTable.tableArn
        ]
      }))
    });

    adminApi.addRoutes({
      path: '/projects',
      methods: [HttpMethod.PUT],
      integration: new LambdaProxyIntegration({
        handler: putProjectFunction
      })
    });

    adminApi.addRoutes({
      path: '/projects/{id}',
      methods: [HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: getProjectFunction
      })
    });

    adminApi.addRoutes({
      path: '/projects/{projectId}/layers',
      methods: [HttpMethod.GET],
      integration: new LambdaProxyIntegration({
        handler: listLayersFunction
      })
    });

    adminApi.addRoutes({
      path: '/projects/{projectId}/layers',
      methods: [HttpMethod.PUT],
      integration: new LambdaProxyIntegration({
        handler: putLayerFunction
      })
    });
  }
}
