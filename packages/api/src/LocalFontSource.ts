import fs from "fs";
import path from "path";
import { Font } from "./Font";
import { FontSource } from "./FontSource";

export class LocalFontSource implements FontSource {
  constructor(public readonly sourceDir: string) {}

  async exists(font: Font) {
    return fs.existsSync(this.getFileName(font));
  }

  async get(font: Font): Promise<Buffer> {
    return fs.readFileSync(this.getFileName(font));
  }

  async set(font: Font, body: Buffer) {
    console.info(`Writing font`);

    try {
      fs.writeFileSync(this.getFileName(font), body);
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  public getFileName(font: Font): string {
    const fontFileName = `${font.key}.ttf`;

    return path.join(this.sourceDir, fontFileName);
  }
}
