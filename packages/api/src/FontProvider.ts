import { FontSource } from "./FontSource";
import { Font } from "./Font";
import { GoogleFontsService } from "./GoogleFontsService";
import { LocalFontSource } from "./LocalFontSource";

export class FontProvider {
  constructor(
    private readonly localSource: LocalFontSource,
    private readonly service: GoogleFontsService,
    private readonly additionalSources: FontSource[] = []
  ) {}

  async getPath(font: Font): Promise<string> {
    const exists = await this.localSource.exists(font);

    if (!exists) {
      let fontBody: Buffer;
      let sourceIndex = 0;
      for (let i=0; i<this.additionalSources.length; i++) {
        const source = this.additionalSources[i];

        if (source.exists(font)) {
          fontBody = await source.get(font);
          continue;
        }

        sourceIndex += 1;
      }

      if (!fontBody) {
        fontBody = await this.service.getFontBody(font);
      }

      console.log({ fontBody });

      const promises: Promise<unknown>[] = [this.localSource.set(font, fontBody)];
      for (let i=sourceIndex-1; i>=0; i--) {
        promises.push(this.additionalSources[i].set(font, fontBody));
      }
      await Promise.all(promises);
    }

    return this.localSource.getFileName(font);
  }
}
