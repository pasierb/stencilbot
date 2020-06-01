import { contain, cover, IntrinsicScale } from 'intrinsic-scale';
import { Layer, ImageFit } from './layer';

export abstract class Renderer {
  abstract loadImage(uri: string): Promise<CanvasImageSource>

  async render(canvas: HTMLCanvasElement, layer: Layer) {
    this.setupCanvas(canvas, async (ctx) => {
      if (layer.imageUri) {
        await this.renderImage(ctx, layer);
      }

      if (layer.text) {
        this.renderText(ctx, layer);
      }
    })
  }

  protected setupCanvas(canvas: HTMLCanvasElement, callback: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("2D Context not available");

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    callback(ctx);

    ctx.restore();
  }

  protected renderText(ctx: CanvasRenderingContext2D, layer: Layer) {
    ctx.fillStyle = layer.color;
    ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;

    const lines = layer.text.split(/\n/);

    // const textMeasure = ctx.measureText(layer.text);
    const h = +layer.fontSize * +layer.lineHeight;
    const offset = (h - +layer.fontSize) / 2;

    lines.forEach((line, i) => {
      const y = +layer.y + ((i + 1) * h) - offset;

      ctx.fillText(line, +layer.x, y);
    });
  }

  protected async renderImage(ctx: CanvasRenderingContext2D, layer: Layer) {
    const { x, y, imageUri } = layer;

    const image = await this.loadImage(imageUri!);
    const scale = this.getScale(ctx.canvas, image, layer);

    ctx.drawImage(image, +x + scale.x, +y + scale.y, scale.width, scale.height);
  }

  protected getScale(canvas: HTMLCanvasElement, img: CanvasImageSource, layer: Layer): IntrinsicScale {
    switch (layer.imageFit) {
      case ImageFit.Contain: {
        return contain(+(layer.width || canvas.width), +(layer.height || canvas.height), +img.width, +img.height);
      }
      case ImageFit.Cover: {
        return cover(+(layer.width || canvas.width), +(layer.height || canvas.height), +img.width, +img.height);
      }
      default: {
        return {
          width: +(layer.width || img.width),
          height: +(layer.height || img.height),
          x: 0,
          y: 0
        }
      }
    }
  }
}