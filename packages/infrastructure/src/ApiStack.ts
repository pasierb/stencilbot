import path from "path";
import { App, Duration, Stack, StackProps } from "@aws-cdk/core";
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";
import { apiPackagePath } from "./constants";

interface ApiStackProps extends StackProps {
  googleFontsApiKey: string
  sentryDSN: string
  stage: string
}

export class ApiStack extends Stack {
  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "sb-api-bucket");

    const nodeModulesLayer = new lambda.LayerVersion(this, 'sb-api-node-modules', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      code: lambda.Code.fromAsset(path.join(apiPackagePath, 'tmp/canvas.zip'))
    });

    const projectFunction = new lambda.Function(this, "sb-api-project-function", {
      code: lambda.Code.fromAsset(path.join(apiPackagePath, "dist")),
      handler: "lambda/index.handler",
      environment: {
        GOOGLE_FONTS_API_KEY: props.googleFontsApiKey,
        SENTRY_DSN: props.sentryDSN,
        BUCKET: bucket.bucketName
      },
      runtime: lambda.Runtime.NODEJS_14_X,
      layers: [nodeModulesLayer],
      timeout: Duration.seconds(5),
      logRetention: logs.RetentionDays.ONE_MONTH
    });

    projectFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: [`${bucket.bucketArn}/*`],
      actions: ["s3:*"]
    }));

    const projectFunctionIntegration = new apigateway.LambdaIntegration(projectFunction);

    const api = new apigateway.RestApi(this, "sb-api-rest-api", {
      deployOptions: {
        stageName: props.stage
      },
      binaryMediaTypes: ["image/png", "*/*"]
    });

    api.root
      .addResource("project")
      .addMethod("GET", projectFunctionIntegration, {});
  }
}