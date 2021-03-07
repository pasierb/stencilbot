import { App } from "@aws-cdk/core";
import { ApiStack } from "../src/ApiStack";
import { DashboardStack } from "../src/DashboardStack";
import { PipelineStack } from "../src/PipelineStack";
import { Stage } from "../src/constants";

const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY!;
const edgeCertificateArn = 'arn:aws:acm:us-east-1:112135394201:certificate/00212b82-36e1-4411-b722-ec445048fd07';
const hostedZoneId = "Z0491224R4WWDOQAX7J0";

// if (!googleFontsApiKey) {
//   throw new Error("GOOGLE_FONTS_API_KEY env variable missing");
// }

const app = new App();

[
  {
    region: "eu-west-1",
    stage: Stage.beta
  },
  {
    region: "eu-west-1",
    stage: Stage.prod
  }
].forEach(({ stage, region }) => {
  new ApiStack(app, `SBApiStack-${stage}-${region}`, {
    env: {
      region
    },
    googleFontsApiKey,
    stage,
    edgeCertificateArn: edgeCertificateArn,
    hostedZoneId
  });

  new DashboardStack(app, `SBDashboardStack-${stage}-${region}`, {
    env: {
      region
    },
    stage,
    edgeCertificateArn: edgeCertificateArn,
    refererHeader: `sb-${stage}`
  });
});

[Stage.beta, Stage.prod].forEach(stage => {
  new PipelineStack(app, `SBPipelineStack-${stage}`, {
    env: {
      region: "eu-west-1"
    },
    stage
  });
})
