import fs from "fs";
import path from "path";
import { Font } from "@stencilbot/renderer";
import { FontSource } from "./FontSource";

export class LocalFontSource implements FontSource {
  constructor(public readonly sourceDir: string) { }

  async exists(font: Font) {
    return fs.existsSync(this.getFileName(font));
  }

  async get(font: Font): Promise<Buffer> {
    return fs.readFileSync(this.getFileName(font));
  }

  async set(font: Font, body: Buffer) {
    fs.writeFileSync(this.getFileName(font), body);
  }

  public getFileName(font: Font): string {
    return path.join(this.sourceDir, font.fileName);
  }
}
