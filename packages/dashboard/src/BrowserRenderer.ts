import { Renderer, Layer, Project } from '@stencilbot/renderer';
import fontProviderSingleton, { FontProvider } from "./FontProvider";
import imageProviderSingleton, { ImageProvider } from "./ImageProvider";

export class BrowserRenderer extends Renderer {
  constructor(
    project: Project,
    private readonly container: HTMLElement,
    private readonly imageProvider: ImageProvider = imageProviderSingleton,
    private readonly fontProvider: FontProvider = fontProviderSingleton
  ) {
    super(project);
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
    return this.imageProvider.load(uri);
  }
}
