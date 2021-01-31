import { Renderer, Layer, Project } from '@stencilbot/renderer';
import fontProviderSingleton, { FontProvider } from "./FontProvider";

export class BrowserRenderer extends Renderer {
  imageCache: Map<string, Promise<HTMLImageElement>> = new Map();
  private readonly fontProvider: FontProvider;

  constructor(project: Project, private readonly container: HTMLElement, fontProvider?: FontProvider) {
    super(project);
    this.fontProvider = fontProvider || fontProviderSingleton;
  }

  getLayerCanvas(layer: Layer) {
    return this.container.children[layer.order!] as HTMLCanvasElement
  }

  onBeforeRender() {
    return Promise.all(
      this.project.layers
        .filter(({ fontObject }) => !!fontObject)
        .map(({ fontObject }) => this.fontProvider.load(fontObject!.family))
    );
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
