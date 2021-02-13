import { App } from "@aws-cdk/core";
import { ApiStack } from "../src/ApiStack";
import { DashboardStack } from "../src/DashboardStack";
import { PipelineStack } from "../src/PipelineStack";
import { getStage } from "../src/constants";

const stage = getStage(process.env.STAGE || "beta");
const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY || "AIzaSyCeT2toZp4PiLqySsuUPWxPun5QLNXNRk4";
const certificateArn = 'arn:aws:acm:us-east-1:112135394201:certificate/00212b82-36e1-4411-b722-ec445048fd07';

if (!googleFontsApiKey) {
  throw new Error("GOOGLE_FONTS_API_KEY env variable missing");
}

const app = new App();

new PipelineStack(app, "SBPipelineStack", {});

new ApiStack(app, "SBApiStack", {
  env: {
    region: "eu-west-1"
  },
  googleFontsApiKey,
  sentryDSN: "",
  stage
});

new DashboardStack(app, "SBDashboardStack", {
  env: {
    region: "eu-west-1"
  },
  refererHeader: "somerefererheader",
  stage,
  certificateArn
});
