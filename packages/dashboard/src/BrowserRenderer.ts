import { Renderer } from '@stencilbot/renderer';

export class BrowserRenderer extends Renderer {
  imageCache: Map<string, HTMLImageElement>

  constructor() {
    super();

    this.imageCache = new Map();
  }

  loadImage(uri: string): Promise<HTMLImageElement> {
    const cached = this.imageCache.get(uri);

    if (cached) {
      return Promise.resolve(cached);
    }

    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.imageCache.set(uri, image);
        resolve(image);
      }
      image.onerror = reject;

      image.src = uri;
    });
  }
}
