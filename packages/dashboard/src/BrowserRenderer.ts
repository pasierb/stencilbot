import { Renderer } from '@stencilbot/renderer';

export class BrowserRenderer extends Renderer {
  imageCache: Map<string, Promise<HTMLImageElement>>

  constructor() {
    super();

    this.imageCache = new Map();
  }

  loadImage(uri: string): Promise<HTMLImageElement> {
    const cached = this.imageCache.get(uri);

    if (cached) {
      return cached;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(image);
      }

      image.onerror = reject;
      image.src = uri;
    });

    this.imageCache.set(uri, promise);

    return promise;
  }
}
