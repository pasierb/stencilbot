import { App, Stack, StackProps } from "@aws-cdk/core";
import { BuildSpec, EventAction, FilterGroup, LinuxBuildImage, Project, Source } from "@aws-cdk/aws-codebuild";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as iam from "@aws-cdk/aws-iam";
import { Stage } from "./constants";

interface PipelineStackProps extends StackProps {
  stage: Stage
}

export class PipelineStack extends Stack {
  readonly stage: Stage;

  constructor(scope: App, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    this.stage = props.stage;

    const secrets = new secretsmanager.Secret(this, "sb-google-fonts-api-key-secret", {
      description: `Stencilbot ${props.stage} secrets`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          GOOGLE_FONTS_API_KEY: "<no-api-key-provided>"
        }),
        generateStringKey: "password"
      }
    });

    const deployRole = new iam.Role(this, "sb-deploy-role", {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(
          this,
          "sb-deploy-role-admin",
          "arn:aws:iam::aws:policy/AdministratorAccess"
        )
      ]
    });

    new Project(this, "sb-code-project", {
      source: Source.gitHub({
        owner: "pasierb",
        repo: "stencilbot",
        webhookFilters: this.webhookFilters
      }),
      buildSpec: this.buildSpecFileName,
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0
      },
      environmentVariables: {
        SECRETS_ID: {
          value: secrets.secretName
        }
      },
      role: deployRole
    });
  }

  get buildSpecFileName(): BuildSpec {
    switch (this.stage) {
      case Stage.beta: {
        return BuildSpec.fromSourceFilename("packages/infrastructure/buildspec.beta.yml");
      }
      case Stage.prod: {
        return BuildSpec.fromSourceFilename("packages/infrastructure/buildspec.prod.yml");
      }
    }
  }

  get webhookFilters(): FilterGroup[] {
    switch (this.stage) {
      case Stage.prod: {
        return [FilterGroup.inEventOf(EventAction.PUSH).andTagIs("v.*")];
      }
      case Stage.beta: {
        return [FilterGroup.inEventOf(EventAction.PUSH).andHeadRefIs("^refs/heads/master$")];
      }
    }
  }
}
