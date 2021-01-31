import { Renderer, Layer, Project } from '@stencilbot/renderer';

export class BrowserRenderer extends Renderer {
  imageCache: Map<string, Promise<HTMLImageElement>> = new Map();

  constructor(project: Project, private readonly container: HTMLElement) {
    super(project);
  }

  getLayerCanvas(layer: Layer) {
    return this.container.children[layer.order!] as HTMLCanvasElement
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
