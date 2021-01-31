import { Font } from "@stencilbot/renderer";
import { S3 } from "aws-sdk";
import { FontSource } from "./FontSource";

export class S3FontSource implements FontSource {
  private cache: Map<string, Buffer> = new Map();
  private readonly s3Client: NonNullable<S3>;

  constructor(private readonly bucket: string, s3Client?: S3) {
    this.s3Client = s3Client || new S3();
  }

  async get(font: Font): Promise<Buffer> {
    if (!this.cache.has(font.fileName)) {
      const result = await this.s3Client.getObject({
        Bucket: this.bucket,
        Key: ""
      }).promise()
        .then(res => Buffer.from(res.Body as string));

      this.cache.set(font.fileName, result);
    }

    return this.cache.get(font.fileName)!;
  }

  set(font: Font, body: Buffer) {
    return this.s3Client.putObject({
      Bucket: this.bucket,
      Key: font.fileName,
      Body: body
    }).promise();
  }

  async exists(font: Font) {
    const result = await this.get(font);

    return !!result;
  }
}
