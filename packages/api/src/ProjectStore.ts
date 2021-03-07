import { S3 } from "aws-sdk";
import { Project } from "@stencilbot/renderer";
import { ServerRenderer } from "./ServerRenderer";

export class ProjectStore {
  private s3: S3;

  constructor(
    readonly bucketName: string
  ) {
    this.s3 = new S3();
  }

  static fileNameFor(project: Project): string {
    return `${Buffer.from(project.toSearchString()).toString("base64")}.png`;
  }

  async save(renderer: ServerRenderer): Promise<string> {
    const key = ProjectStore.fileNameFor(renderer.project);

    await renderer.render()
    await this.s3.putObject({
      Bucket: this.bucketName,
      Key: key,
      Body: renderer.base.toBuffer(),
      ContentType: "image/png",
      CacheControl: "public, max-age=2592000, immutable"
    }).promise();

    return key;
  }
}
