import { ProjectHandler } from "../ProjectHandler";
import { LocalFontSource } from "../LocalFontSource";
import { S3FontSource } from "../S3FontSource";
import { FontProvider } from "../FontProvider";
import { ImageProvider } from "../ImageProvider";
import { GoogleFontsService } from "../GoogleFontsService";

const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY;
const s3SourceBucketName = process.env.BUCKET;

if (!googleFontsApiKey) {
  throw new Error("GOOGLE_FONTS_API_KEY env variable not defined");
}

if (!s3SourceBucketName) {
  throw new Error("BUCKET env variable not defined");
}

const localFontSource = new LocalFontSource("tmp");
const s3FontSource = new S3FontSource(s3SourceBucketName);
const googleFontsService = new GoogleFontsService(googleFontsApiKey);
const fontProvider = new FontProvider(localFontSource, googleFontsService, [s3FontSource])
const imageProvider = new ImageProvider();
const projectHandler = new ProjectHandler(fontProvider, imageProvider);

export const handler = projectHandler.handle;
