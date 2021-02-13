import path from "path";

export const rootPackagePath = path.resolve(__dirname, "../../..");
export const apiPackagePath = path.resolve(rootPackagePath, "packages/api");
export const dashboardPackagePath = path.resolve(rootPackagePath, "packages/dashboard");

export enum Stage {
  prod = "prod",
  beta = "beta"
}

export function getStage(name: string): Stage {
  return Stage[name as Stage] || Stage.beta;
}
