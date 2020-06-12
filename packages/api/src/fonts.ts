import path from 'path';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import { registerFont } from 'canvas';
import { S3 } from 'aws-sdk';

const s3 = new S3();
const fontsBasePath = '/tmp';
const googleFontsAPIKey = process.env.GOOGLE_FONTS_API_KEY;
const fontsBucket = process.env.BUCKET;

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
  family: string
  variant: string
  data: GoogleWebFontsAPIResponse

  constructor(name: string, data: GoogleWebFontsAPIResponse) {
    const [family, variant] = name.split(':');

    this.family = family;
    this.variant = variant;
    this.data = data;
  }

  get remotePath() {
    const font = this.data.items.find(item => item.family === this.family);

    return font.files[this.variant];
  }

  get key() {
    return [this.family, this.variant].join('-').replace(/\s+/g, '_');
  }

  get s3Key() {
    return ['fonts', this.key].join('/')
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
}

function fetchData() {
  if (googleFontsDataPromise) {
    return googleFontsDataPromise;
  }

  googleFontsDataPromise = fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${googleFontsAPIKey}`).then(r => r.json())

  return googleFontsDataPromise;
}

export function registerDefaultFonts() {
  registerFont(path.join(__dirname, 'fonts/Roboto-Regular.ttf'), { family: 'Roboto' });
}

export async function registerGoogleFont(name: string) {
  const data = await fetchData();
  const localFont = new LocalFont(name, data);

  if (!localFont.exists()) {
    await localFont.fetch();
  }

  return registerFont(localFont.path, { family: localFont.family });
}
