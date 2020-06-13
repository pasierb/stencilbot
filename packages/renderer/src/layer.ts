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

export enum LayerType {
  Empty,
  Text,
  Image,
  ImageAndText
}

type LayerAttributeName = keyof LayerInit;

const layerParamRegExp = /^(?<order>\d+)\.(?<attr>\w+)$/;
const fontVariantRegExp = /^(?<weight>\d{3})?(?<style>\w+)?$/

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
  'valign'
];

export class Layer {
  id: string
  order?: number
  x?: number
  y?: number
  w?: number
  h?: number
  bg?: string

  txt?: string
  color?: string
  fontSize?: number
  font?: string
  lineH?: number
  txtAlign?: TextAlign | string
  valign?: VerticalAlign | string

  img?: string
  imgFit?: string

  constructor(init: LayerInit = {}) {
    this.id = init.id || Layer.generateId();

    Object.entries(init).forEach(([ key, value]) => {
      this.setAttribue(key as keyof LayerInit, value)
    });
  }

  setAttribue(key: keyof LayerInit, value: any) {
    switch(key) {
      case 'x':
      case 'y':
      case 'w':
      case 'h':
      case 'fontSize':
      case 'order':
        this[key] = value !== undefined ? parseInt(value) : undefined;
        break;
      case 'lineH':
        this[key] = value !== undefined ? parseFloat(value) : undefined;
        break;
      default:
        this[key] = value;
        break;
    }
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

  get fontVariant() {
    return this.font?.split(':')[1]
  }

  get fontFamily() {
    return this.font?.split(':')[0]
  }

  get fontStyle() {
    const style = this.fontVariant?.match(fontVariantRegExp)?.groups?.style;

    return style === 'regular' ? undefined : style;
  }

  get fontWeight() {
    return this.fontVariant?.match(fontVariantRegExp)?.groups?.weight;
  }

  toSearchString() {
    const { order } = this;
    const items: string[] = [];

    serializeableAttributes.forEach(attr => {
      if (this[attr] !== undefined) {
        items.push(`${order}.${attr}=${encodeURIComponent(this[attr]!.toString())}`)
      }
    });

    return items.join('&');
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static fromSearchParams(input: {[key: string]: string}): Layer[] {
    return Object.entries(input).reduce<Layer[]>((acc, [k, v]) => {
      const match = k.match(layerParamRegExp);

      if (match) {
        const order = +match.groups!.order
        const layer = acc[order] || new Layer({ order });
        const attr = match.groups!.attr as keyof LayerInit;

        layer.setAttribue(attr, v);

        acc[order] = layer;
      }

      return acc;
    }, []).filter(l => l);
  }
}