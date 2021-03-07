import http, { OutgoingHttpHeaders } from "http";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import querystring from "querystring";
import { APIGatewayProxyEvent } from 'aws-lambda'
import { ProjectHandler } from "../ProjectHandler";
import { LocalFontSource } from "../LocalFontSource";
import { FontProvider } from "../FontProvider";
import { ImageProvider } from "../ImageProvider";
import { GoogleFontsService } from "../GoogleFontsService";

dotenv.config();
const port = 3001;

const googleFontsApiKey = process.env.GOOGLE_FONTS_API_KEY;
if (!googleFontsApiKey) {
  throw new Error("GOOGLE_FONTS_API_KEY env variable is not set");
}

const localFontSource = new LocalFontSource(path.resolve(__dirname, "../../tmp"));
const googleFontsService = new GoogleFontsService(googleFontsApiKey);
const fontProvider = new FontProvider(localFontSource, googleFontsService);
const imageProvider = new ImageProvider();
const projectHandler = new ProjectHandler(fontProvider, imageProvider);

const server = http.createServer(async (req, res) => {
  try {
    const queryString = url.parse(req.url!).query;
    const query = querystring.parse(queryString!) as {[key: string]: string };

    console.info(`Query:`, JSON.stringify(query));

    const result = await projectHandler.handle({
      queryStringParameters: query
    } as APIGatewayProxyEvent);

    res.writeHead(result.statusCode, result.headers as OutgoingHttpHeaders);
    res.end(Buffer.from(result.body, 'base64'));
  } catch (err) {
    console.error(`Error: `, err);

    res.writeHead(500);
    res.end(err.message);
  }
});

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
});
