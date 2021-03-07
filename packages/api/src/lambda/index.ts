import { ProjectHandler } from "../ProjectHandler";
import { LocalFontSource } from "../LocalFontSource";
// import { S3FontSource } from "../S3FontSource";
import { FontProvider } from "../FontProvider";
import { ImageProvider } from "../ImageProvider";
import { GoogleFontsService } from "../GoogleFontsService";
import { ProjectStore } from "../ProjectStore";

const s3SourceBucketName = process.env.BUCKET;
if (!s3SourceBucketName) {
  throw new Error("BUCKET env variable not defined");
}

const s3SourceBucketURL = process.env.BUCKET_URL;
if (!s3SourceBucketURL) {
  throw new Error("BUCKET_URL env variable not defined");
}

const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY;
if (!googleFontsApiKey) {
  throw new Error("GOOGLE_FONTS_API_KEY env variable not defined");
}


const localFontSource = new LocalFontSource("/tmp");
// const s3FontSource = new S3FontSource(s3SourceBucketName);
const googleFontsService = new GoogleFontsService(googleFontsApiKey);
const fontProvider = new FontProvider(localFontSource, googleFontsService, []);
const imageProvider = new ImageProvider();
const projectStore = new ProjectStore(s3SourceBucketName);
const projectHandler = new ProjectHandler(
  fontProvider,
  imageProvider,
  {
    store: projectStore,
    domain: s3SourceBucketURL
  }
);

export const handler = projectHandler.handle.bind(projectHandler);
