import fetch from "node-fetch";
import { Font } from "@stencilbot/renderer";

interface GoogleWebFontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: { [key: string]: string }
  category: string
  kind: string
}

interface GoogleWebFontsAPIResponse {
  kind: string
  items: GoogleWebFontFamily[]
}

export class GoogleFontsService {
  private _data: GoogleWebFontsAPIResponse | undefined;

  constructor(private readonly apiKey: string) {}

  private getVariant(font: Font): string {
    return [font.weight, font.style].filter(it => !!it).join('') || "regular";
  }

  async getFontBody(font: Font): Promise<Buffer> {
    const data = await this.getData();
    const variant = this.getVariant(font);

    const family = data.items.find(it => it.family === font.family);
    if (!family) {
      throw new Error();
    }

    const fontURL = family.files[variant];
    if (!fontURL) {
      throw new Error(`Could not find font variant "${variant}" in ${JSON.stringify(family)}`);
    }

    return fetch(fontURL)
      .then(res => res.buffer())
      .catch(err => {
        console.error(`Failed to get font body: ${err}`);

        throw err;
      });
  }

  private async getData(): Promise<GoogleWebFontsAPIResponse> {
    if (!this._data) {
      this._data = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apiKey}`)
        .then(r => r.json())
        .then(r => {
          console.log(r);

          return r;
        })
        .catch(err => {
          throw new Error(`Failed to fetch Google Fonts data: ${err}`)
        })
    }

    return this._data!;
  }
}
