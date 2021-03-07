import path from "path";
import { App, CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as certificateManager from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import { apiPackagePath, Stage } from "./constants";

interface ApiStackProps extends StackProps {
  googleFontsApiKey: string;
  stage: Stage;
  edgeCertificateArn: string;
  hostedZoneId: string;
}

export class ApiStack extends Stack {
  readonly stage: Stage;

  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.stage = props.stage;
    const hostedZone = route53.HostedZone.fromHostedZoneId(this, "sb-hosted-zone", props.hostedZoneId);

    const certificate = new certificateManager.Certificate(this, "sb-certificate", {
      domainName: "stencilbot.io",
      subjectAlternativeNames: [
        "*.stencilbot.io",
      ],
      validation: certificateManager.CertificateValidation.fromDns(hostedZone)
    });

    const bucket = new s3.Bucket(this, "sb-api-bucket", {
      removalPolicy: RemovalPolicy.DESTROY
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, "sb-api-bucket-oai");

    const cdnDistribution = new cloudfront.CloudFrontWebDistribution(this, "sb-api-cdn-distribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity
          },
          behaviors: [
            {
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              isDefaultBehavior: true
            }
          ]
        }
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      viewerCertificate: {
        aliases: [this.cdnDomainName],
        props: {
          acmCertificateArn: props.edgeCertificateArn,
          sslSupportMethod: "sni-only"
        }
      }
    });

    const nodeModulesLayer = new lambda.LayerVersion(this, 'sb-api-node-modules', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      code: lambda.Code.fromAsset(path.join(apiPackagePath, 'tmp/canvas.zip'))
    });

    const projectFunction = new lambda.Function(this, "sb-api-project-function", {
      code: lambda.Code.fromAsset(path.join(apiPackagePath, "dist")),
      handler: "lambda/index.handler",
      environment: {
        GOOGLE_FONTS_API_KEY: props.googleFontsApiKey,
        BUCKET: bucket.bucketName,
        BUCKET_URL: this.cdnDomainName
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
      domainName: {
        domainName: this.apiDomainName,
        endpointType: apigateway.EndpointType.REGIONAL,
        certificate
      },
      deployOptions: {
        stageName: props.stage,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      binaryMediaTypes: ["image/png", "*/*"]
    });

    new CfnOutput(this, "SourceBucketName", { value: bucket.bucketName })

    api.root
      .addResource("project")
      .addMethod("GET", projectFunctionIntegration, {});
  }

  get apiHost(): string {
    return `https://${this.apiDomainName}`
  }

  get cdnDomainName(): string {
    switch (this.stage) {
      case Stage.beta: {
        return "cdn-beta.stencilbot.io";
      }
      case Stage.prod: {
        return "cdn.stencilbot.io";
      }
    }
  }

  get apiDomainName(): string {
    switch (this.stage) {
      case Stage.beta: {
        return "api-beta.stencilbot.io";
      }
      case Stage.prod: {
        return "api.stencilbot.io";
      }
    }
  }
}