import { Font } from "@stencilbot/renderer";

export interface FontSource {
  exists: (font: Font) => Promise<boolean>;
  get: (font: Font) => Promise<Buffer>;
  set: (font: Font, body: Buffer) => Promise<unknown>;
}
