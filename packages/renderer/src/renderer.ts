import { contain, cover, IntrinsicScale } from 'intrinsic-scale';

export interface Layer {
  x?: number
  y?: number
  width?: number
  height?: number
  text?: string
  imageUri?: string
  imageFit?: string
  fontUri?: string
  fontSize?: number
  fontFamily?: string
  color?: string
}

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain'
}

export abstract class Renderer {
  abstract loadImage(uri: string): Promise<CanvasImageSource>

  async render(canvas: HTMLCanvasElement, layer: Layer) {
    const ctx = canvas.getContext('2d')!;
    const {
      x = 0,
      y = 0,
      color = '#000',
      fontSize = 15,
      fontFamily = 'Arial'
    } = layer;

    ctx.fillStyle = color;

    if (layer.imageUri) {
      const image = await this.loadImage(layer.imageUri);
      const scale = this.getScale(canvas, image, layer);

      ctx.drawImage(image, x + scale.x, y + scale.y, scale.width, scale.height);
    }

    if (layer.text) {
      ctx.font = `${fontSize}px ${fontFamily}`;

      const textMeasure = ctx.measureText(layer.text);
      const h = textMeasure.actualBoundingBoxAscent;

      ctx.fillText(layer.text, x, y + h);
    }
  }

  getScale(canvas: HTMLCanvasElement, img: CanvasImageSource, layer: Layer): IntrinsicScale {
    switch(layer.imageFit) {
      case ImageFit.Contain: {
        return contain(layer.width || canvas.width, layer.height || canvas.height, +img.width, +img.height);
      }
      case ImageFit.Cover: {
        return cover(layer.width || canvas.width, layer.height || canvas.height, +img.width, +img.height);
      }
      default: {
        return {
          width: layer.width || +img.width,
          height: layer.height || +img.height,
          x: 0,
          y: 0
        }
      }
    }
  }
}