import { contain, cover, IntrinsicScale } from 'intrinsic-scale';
import { Layer, ImageFit, TextAlign, VerticalAlign } from './layer';

export abstract class Renderer {
  abstract loadImage(uri: string): Promise<CanvasImageSource>

  render(canvas: HTMLCanvasElement, layer: Layer) {
    return this.setupCanvas(canvas, async (ctx) => {
      await this.withCleanContext(ctx, c => this.renderBackground(c, layer))
      await this.withCleanContext(ctx, c => this.renderImage(c, layer))
      await this.withCleanContext(ctx, c => this.renderText(c, layer))
    });
  }

  protected async setupCanvas(canvas: HTMLCanvasElement, callback: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("2D Context not available");

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await callback(ctx);

    ctx.restore();
  }

  protected async withCleanContext(ctx: CanvasRenderingContext2D, callback: (ctx: CanvasRenderingContext2D) => void) {
    ctx.save();

    await callback(ctx);
    
    ctx.restore();
  }

  protected renderBackground(ctx: CanvasRenderingContext2D, layer: Layer) {
    let {
      w = ctx.canvas.width,
      h = ctx.canvas.height,
      x = 0,
      y = 0,
      bg
    } = layer;

    if (bg) {
      ctx.fillStyle = `${bg}`;
      ctx.fillRect(x, y, w, h);
    }
  }

  protected renderText(ctx: CanvasRenderingContext2D, layer: Layer) {
    let {
      x = 0,
      y = 0,
      w: width = ctx.canvas.width,
      h: height = ctx.canvas.height,
      lineH = 1,
      txtAlign = TextAlign.Start,
      valign,
      txt,
      color,
      fontSize = 14,
      fontFamily,
      fontWeight = '',
      fontStyle = ''
    } = layer;

    if (!txt || !fontFamily) {
      return;
    }

    if (color) {
      ctx.fillStyle = color;
    }

    const fontDeclaration = [
      fontStyle,
      fontWeight,
      `${fontSize}px`,
      `"${fontFamily}"`
    ].filter(it => !!it).join(' ');

    ctx.font = fontDeclaration;
    ctx.textAlign = txtAlign as CanvasTextAlign;

    if (txtAlign === TextAlign.Center) {
      x += width / 2;
    }

    const lines = txt.split(/\n/)
      .map(line =>this.fitText(ctx, line, width))
      .reduce<string[]>((acc, it) => [...acc, ...it], []);

    const h = +fontSize * +lineH;
    const offset = (h - +fontSize) / 2;
    const textHeight = (lines.length * h);

    switch(valign) {
      case VerticalAlign.Middle: {
        y += ((height - y) / 2) - (textHeight / 2);

        break;
      }
      case VerticalAlign.Bottom: {
        y += height - textHeight;
      }
    }

    lines.forEach((line, i) => {
      const yi = +y + ((i + 1) * h) - offset;

      ctx.fillText(line, +x, yi);
    });
  }

  protected async renderImage(ctx: CanvasRenderingContext2D, layer: Layer) {
    let {
      x = 0,
      y = 0,
      img,
      valign
    } = layer;

    if (!img) {
      return;
    }

    const image = await this.loadImage(img);
    const scale = this.getScale(ctx.canvas, image, layer);

    switch(valign) {
      case VerticalAlign.Middle: {
        const offset = (ctx.canvas.height - scale.height) / 2;
        y += offset;
        break;
      }
      case VerticalAlign.Bottom: {
        const offset = (ctx.canvas.height - scale.height);
        y += offset;
        break;
      }
    }

    ctx.drawImage(image, +x + scale.x, +y + scale.y, scale.width, scale.height);
  }

  protected getScale(canvas: HTMLCanvasElement, img: CanvasImageSource, layer: Layer): IntrinsicScale {
    switch (layer.imgFit) {
      case ImageFit.Contain: {
        return contain(+(layer.w || canvas.width), +(layer.h || canvas.height), +img.width, +img.height);
      }
      case ImageFit.Cover: {
        return cover(+(layer.w || canvas.width), +(layer.h || canvas.height), +img.width, +img.height);
      }
      default: {
        return {
          width: +(layer.w || img.width),
          height: +(layer.h || img.height),
          x: 0,
          y: 0
        }
      }
    }
  }

  protected fitText(ctx: CanvasRenderingContext2D, text: string, width: number = ctx.canvas.width): string[] {
    if (!text) {
      return [];
    }

    if (ctx.measureText(text).width <= width) {
      return [text];
    }

    const words = text.split(' ');
    const result: string[] = [];
    let curr: string[] = [];

    while(words.length) {
      const word = words.shift()!;

      if (ctx.measureText([...curr, word].join(' ')).width <= width) {
        curr.push(word);
      } else {
        result.push(curr.join(' '));
        curr = [word];
      }
    }

    if (curr.length) {
      result.push(curr.join(' '));
    }

    return result;
  }
}