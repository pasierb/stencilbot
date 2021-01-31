import { Renderer, Project } from "@stencilbot/renderer";
import { Canvas, createCanvas, loadImage, registerFont } from 'canvas';
import { Font } from "./Font";
import { FontProvider } from "./FontProvider";
import { ImageProvider } from "./ImageProvider";

export class ServerRenderer extends Renderer {
  public readonly base: Canvas;
  
  constructor(project: Project, readonly fontProvider: FontProvider, readonly imageProvider: ImageProvider) {
    super(project);
    this.base = createCanvas(project.width, project.height);
  }

  getLayerCanvas() {
    return createCanvas(this.project.width, this.project.height) as unknown as HTMLCanvasElement;
  }

  loadImage(uri: string) {
    return this.imageProvider.load(uri)
      .then(buf => loadImage(buf) as unknown as CanvasImageSource)
  }

  onBeforeRender() {
    return Promise.all([
      this.preloadImages(),
      this.registerFonts()
    ]);
  }

  onAfterRender(layers: HTMLCanvasElement[]) {
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
    return Promise.all(this.project.layers.map(layer =>
      new Promise((resolve, reject) => {
        if (layer.font) {
          const font = new Font({
            family: layer.fontFamily,
            style: layer.fontStyle,
            weight: layer.fontWeight
          });

          return this.fontProvider
            .getPath(font)
            .then(fontPath => {
              registerFont(fontPath, {
                family: font.family,
                weight: font.weight,
                style: font.style
              });
            })
            .then(resolve)
            .catch(reject);
        } else {
          return Promise.resolve(null);
        }
      })
    ));
  }

  private preloadImages() {
    return Promise.all(this.project.layers.map(({ img }) => {
      return new Promise((resolve, reject) => {
        if (img) {
          this.imageProvider
            .load(img)
            .then(resolve);
        } else {
          resolve(null);
        }
      });
    }));
  }
}