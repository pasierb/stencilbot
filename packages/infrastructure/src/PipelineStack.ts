import { App, Stack, StackProps } from "@aws-cdk/core";
import { EventAction, FilterGroup, LinuxBuildImage, Project, Source } from "@aws-cdk/aws-codebuild";

export class PipelineStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    new Project(this, "asdf", {
      source: Source.gitHub({
        owner: "pasierb",
        repo: "stencilbot",
        webhookFilters: [
          FilterGroup.inEventOf(EventAction.PUSH).andHeadRefIs("^refs/heads/master$")
        ]
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0
      }
    });
  }
}
