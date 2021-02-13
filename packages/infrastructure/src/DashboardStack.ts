import path from "path";
import { App, Stack, StackProps, RemovalPolicy, Duration } from "@aws-cdk/core"
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { dashboardPackagePath, Stage } from "./constants";

interface DashboardStackProps extends StackProps {
  refererHeader: string
  stage: Stage
  certificateArn: string
}

export class DashboardStack extends Stack {
  constructor(scope: App, id: string, props: DashboardStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'sb-dashboard-static', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: false
    });

    const bucketWebsitePolicy = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [
        `${bucket.bucketArn}/*`
      ],
      conditions: {
        'StringLike': {
          'aws:Referer': props.refererHeader
        }
      }
    });

    bucketWebsitePolicy.addAnyPrincipal();

    bucket.addToResourcePolicy(bucketWebsitePolicy);

    new s3Deployment.BucketDeployment(this, 'dashboard-static-deployment', {
      destinationBucket: bucket,
      sources: [
        s3Deployment.Source.asset(path.join(dashboardPackagePath, './out'))
      ],
      cacheControl: [
        s3Deployment.CacheControl.maxAge(Duration.days(30))
      ],
      retainOnDelete: true
    });

    new cloudfront.CloudFrontWebDistribution(this, 'sb-dashboard-web-distribution', {
      originConfigs: [
        {
          customOriginSource: {
            domainName: bucket.bucketWebsiteDomainName,
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
          },
          // s3OriginSource: {
          //   s3BucketSource: bucket,
          //   originAccessIdentity: new cloudfront.OriginAccessIdentity(this, "sb-dashboard-access-identity")
          // },
          behaviors: [
            {
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              isDefaultBehavior: true,
              forwardedValues: {
                queryString: true
              }
            }
          ],
          originHeaders: {
            Referer: props.refererHeader
          }
        }
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      errorConfigurations: [
        {
          errorCode: 404,
          responseCode: 404,
          responsePagePath: '/404.html'
        }
      ],
      aliasConfiguration: {
        names: this.getAliasNames(props.stage),
        acmCertRef: props.certificateArn
      }
    })
  }

  private getAliasNames(stage: Stage): string[] {
    return stage === Stage.prod ? [
      'stencilbot.io',
      'www.stencilbot.io'
    ] : [
      'beta.stencilbot.io',
    ];
  }
}
