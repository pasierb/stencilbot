import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import { registerFont } from 'canvas';
import { S3 } from 'aws-sdk';

const s3 = new S3();
const fontsBasePath = '/tmp';
const googleFontsAPIKey = process.env.GOOGLE_FONTS_API_KEY;
const fontsBucket = process.env.BUCKET;
const fontVariantRegExp = /^(?<weight>\d{3})?(?<style>\w+)?$/

const lolcalFontsDir = path.join(__dirname, '../fonts');

interface GoogleWebFontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: {[key: string]: string}
  category: string
  kind: string
}

interface GoogleWebFontsAPIResponse {
  kind: string
  items: GoogleWebFontFamily[]
}

let googleFontsDataPromise: Promise<GoogleWebFontsAPIResponse>;

class LocalFont {
  data: GoogleWebFontsAPIResponse
  family: string
  variant: string
  weight?: string
  style?: string

  constructor(opts: { name: string, data: GoogleWebFontsAPIResponse, fontWeight: string, fontStyle: string }) {
    const { name, fontWeight, fontStyle, data } = opts;
    const [family, variant] = name.split(':');
    const { weight, style } = LocalFont.parseVariant(variant);

    this.family = family;
    this.variant = variant;
    this.data = data;
    this.weight = fontWeight;
    this.style = fontStyle;
  }

  get googleFontFamily() {
    return this.data.items.find(item => item.family === this.family);
  }

  get remotePath() {
    return this.googleFontFamily.files[this.variant];
  }

  get key() {
    return this.s3Key.replace(/\//g, '-');
  }

  get s3Key() {
    const url = new URL(this.remotePath);

    return `fonts${url.pathname}`;
  }

  get path() {
    return [fontsBasePath, this.key].join('/');
  }

  exists() {
    return fs.existsSync(this.path);
  }

  async getFromS3() {
    const res = await s3.getObject({
      Bucket: fontsBucket,
      Key: this.s3Key
    }).promise();

    return res.Body;
  }

  putToS3(body: S3.Body) {
    return s3.putObject({
      Bucket: fontsBucket,
      Key: this.s3Key,
      Body: body
    }).promise();
  }

  saveToFileSystem(body) {
    fs.writeFileSync(this.path, body);
  }

  getFromOrigin() {
    return fetch(this.remotePath).then(r => r.buffer());
  }

  async fetch() {
    try {
      const body = await this.getFromS3();
      this.saveToFileSystem(body);
    } catch(e) {
      const body = await this.getFromOrigin();

      await this.putToS3(body);
      this.saveToFileSystem(body);
    }
  }

  static parseVariant(variant: string): { weight: string | undefined, style: string | undefined } {
    const match = variant.match(fontVariantRegExp);

    return {
      weight: match ? match.groups.weight : undefined,
      style: match ? match.groups.style : undefined
    };
  }
}

function fetchData() {
  if (googleFontsDataPromise) {
    return googleFontsDataPromise;
  }

  googleFontsDataPromise = fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${googleFontsAPIKey}`).then(r => r.json())

  return googleFontsDataPromise;
}

export async function registerGoogleFont(name: string, fontWeight?: string, fontStyle?: string) {
  const data = await fetchData();
  const localFont = new LocalFont({ name, data, fontStyle, fontWeight });

  if (!localFont.exists()) {
    await localFont.fetch();
  }

  return registerFont(localFont.path, {
    family: localFont.family,
    weight: localFont.weight,
    style: localFont.style
  });
}

export function registerDefaultFonts() {
  [
    ['Noto Color Emoji', 'NotoColorEmoji.ttf']
  ].forEach(([family, fileName]) => {
    registerFont(path.join(lolcalFontsDir, fileName), {
      family
    });
  })
}
