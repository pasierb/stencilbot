import { Renderer, Project, Font } from "@stencilbot/renderer";
import { Canvas, createCanvas, loadImage, registerFont, Image } from 'canvas';
import { FontProvider } from "./FontProvider";
import { ImageProvider } from "./ImageProvider";

export class ServerRenderer extends Renderer {
  public readonly base: Canvas;
  
  constructor(
    project: Project,
    private readonly fontProvider: FontProvider,
    private readonly imageProvider: ImageProvider
  ) {
    super(project);
    this.base = createCanvas(project.width, project.height);
  }

  getLayerCanvas(): HTMLCanvasElement {
    return createCanvas(this.project.width, this.project.height) as unknown as HTMLCanvasElement;
  }

  loadImage(uri: string): Promise<CanvasImageSource> {
    return this.imageProvider
      .load(uri)
      .then(buf =>
        loadImage(buf) as unknown as Promise<CanvasImageSource>
      );
  }

  onBeforeRender() {
    return Promise.all([
      this.preloadImages(),
      this.registerFonts()
    ]);
  }

  onAfterRender(layers: HTMLCanvasElement[]): void {
    this.combineLayers(layers);
  }

  private combineLayers(layers: HTMLCanvasElement[]) {
    const ctx = this.base.getContext('2d');
    const { width, height } = this.project;

    layers.forEach(layer => {
      ctx.drawImage(layer, 0, 0, width, height);
    });
  }

  private registerFonts() {
    return Promise.all(
      this.project.layers
        .filter(({ fontObject }) => !!fontObject)
        .map(({ fontObject: font }) =>
          this.fontProvider
            .getPath(font!)
            .then(fontPath => {
              registerFont(fontPath, {
                family: font!.family,
                weight: font!.weight,
                style: font!.style
            })
          })
        )
    );
  }

  private preloadImages() {
    return Promise.all(
      this.project.layers
        .filter(({ img }) => !!img)
        .map(({ img }) => this.imageProvider.load(img!))
    );
  }
}