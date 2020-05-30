import { Renderer, Layer } from '@cardstamp/renderer';
import { loadImage, Image } from 'canvas';

export class ServerRenderer extends Renderer {
  loadImage(uri: string) {
    return loadImage(uri) as unknown as Promise<CanvasImageSource>;
  }
}
