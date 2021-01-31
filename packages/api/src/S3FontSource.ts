import { S3 } from "aws-sdk";
import { Font } from "./Font";
import { FontSource } from "./FontSource";

export class S3FontSource implements FontSource {
  private cache: Map<string, Buffer> = new Map();

  constructor(private readonly bucket: string, private readonly s3Client?: S3) {
    this.s3Client = s3Client || new S3();
  }

  async get(font: Font): Promise<Buffer> {
    if (!this.cache.has(font.key)) {
      const result = await this.s3Client.getObject({
        Bucket: this.bucket,
        Key: ""
      }).promise()
        .then(res => Buffer.from(res.Body));

      this.cache.set(font.key, result);
    }

    return this.cache.get(font.key);
  }

  set(font: Font, body: Buffer) {
    return this.s3Client.putObject({
      Bucket: this.bucket,
      Key: font.key,
      Body: body
    }).promise();
  }

  async exists(font: Font) {
    const result = await this.get(font);

    return !!result;
  }
}
