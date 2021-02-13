import { Font } from "./Font";

export type LayerInit = {
  id?: string
  order?: number
  x?: number
  y?: number
  w?: number
  h?: number
  txt?: string
  img?: string
  imgFit?: string
  fontSize?: number
  font?: string
  lineH?: number
  txtAlign?: string | TextAlign
  valign?: string | VerticalAlign
  color?: string
  bg?: string
  alpha?: number
  rp?: string | RepeatPattern
}

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain',
  None = 'none'
}

export enum VerticalAlign {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom'
}

export enum TextAlign {
  Start = 'start',
  End = 'end',
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export enum RepeatPattern {
  X = 'x',
  Y = 'y',
  XY = 'xy'
}

export enum LayerType {
  Empty,
  Text,
  Image,
  ImageAndText
}

type LayerAttributeName = keyof LayerInit;

const layerParamRegExp = /^(\d+)\.(\w+)$/;

const serializeableAttributes: LayerAttributeName[] = [
  'x',
  'y',
  'w',
  'h',
  'bg',
  'imgFit',
  'img',
  'txt',
  'color',
  'fontSize',
  'font',
  'lineH',
  'txtAlign',
  'valign',
  'alpha',
  'rp'
];

export class Layer {
  id: string
  order?: number
  x?: number
  y?: number
  w?: number
  h?: number
  bg?: string
  alpha?: number

  txt?: string
  color?: string
  fontSize?: number
  font?: string
  lineH?: number
  txtAlign?: TextAlign | string
  valign?: VerticalAlign | string

  img?: string
  imgFit?: string
  rp?: string | RepeatPattern

  constructor(init: LayerInit = {}) {
    this.id = init.id || Layer.generateId();

    Object.entries(init).forEach(([ key, value]) => {
      this.setAttribue(key as keyof LayerInit, value)
    });
  }

  setAttribue(key: keyof LayerInit, value: string | number | undefined): void {
    switch(key) {
      case 'x':
      case 'y':
      case 'w':
      case 'h':
      case 'fontSize':
      case 'order':
        this[key] = value !== undefined ? parseInt(value + "") : undefined;
        break;
      case 'lineH':
      case 'alpha':
        this[key] = value !== undefined ? parseFloat(value + "") : undefined;
        break;
      default:
        if (value !== undefined) {
          this[key] = value + "";
        }
    }
  }

  get isRepeat(): boolean {
    return this.rp ? this.rp in RepeatPattern : false;
  }

  get type(): LayerType {
    if (this.txt && this.img) {
      return LayerType.ImageAndText;
    }

    if (this.txt) {
      return LayerType.Text;
    }

    if (this.img) {
      return LayerType.Image;
    }

    return LayerType.Empty;
  }

  get fontObject(): Font | undefined {
    if (!this.font) {
      return undefined;
    }

    return new Font(this.font);
  }

  toSearchString(): string {
    const { order } = this;
    const items: string[] = [];

    serializeableAttributes.forEach(attr => {
      const value = this[attr];

      if (value !== undefined) {
        items.push(`${order}.${attr}=${encodeURIComponent(value.toString())}`)
      }
    });

    return items.join('&');
  }

  static generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static fromSearchParams(input: {[key: string]: string}): Layer[] {
    return Object.entries(input).reduce<Layer[]>((acc, [k, v]) => {
      const match = k.match(layerParamRegExp);

      if (match) {
        const order = +match[1]
        const layer = acc[order] || new Layer({ order });
        const attr = match[2] as keyof LayerInit;

        layer.setAttribue(attr, v);

        acc[order] = layer;
      }

      return acc;
    }, []).filter(l => l);
  }
}