import http from "http";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import querystring from "querystring";
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ProjectHandler } from "../src/ProjectHandler";
import { LocalFontSource } from "../src/LocalFontSource";
import { FontProvider } from "../src/FontProvider";
import { ImageProvider } from "../src/ImageProvider";
import { GoogleFontsService } from "../src/GoogleFontsService";

dotenv.config();
const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY;
const port = 3001;

const localFontSource = new LocalFontSource(path.resolve(__dirname, "../tmp"));
const googleFontsService = new GoogleFontsService(googleFontsApiKey);
const fontProvider = new FontProvider(localFontSource, googleFontsService);
const imageProvider = new ImageProvider();
const projectHandler = new ProjectHandler(fontProvider, imageProvider);

const server = http.createServer(async (req, res) => {
  try {
    const queryString = url.parse(req.url).query;
    const query = querystring.parse(queryString) as {[key: string]: string };

    const result = await projectHandler.handle({
      queryStringParameters: query
    } as APIGatewayProxyEvent);

    res.writeHead(result.statusCode, result.headers);
    res.end(Buffer.from(result.body, 'base64'));
  } catch (err) {
    console.error(err);

    res.writeHead(500);
    res.end(err.message);
  }
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
});
