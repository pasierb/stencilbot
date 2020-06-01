import { Renderer } from '@stencilbot/renderer';

export class BrowserRenderer extends Renderer {
  loadImage(uri: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = uri;
    });
  }
}
