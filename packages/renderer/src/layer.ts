export type LayerInit = {
  id?: string
  order?: number
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
  fontWeight?: string
  lineHeight?: number
  textAlign?: string | TextAlign
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

const serializeableAttributes: LayerAttributeName[] = [
  'x',
  'y',
  'width',
  'height',
  'bg',
  'imageFit',
  'imageUri',
  'text',
  'color',
  'fontUri',
  'fontSize',
  'fontFamily',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'valign'
];

export class Layer {
  id: string
  order?: number
  x?: number
  y?: number
  width?: number
  height?: number
  bg?: string

  text?: string
  color?: string
  fontUri?: string
  fontSize: number
  fontFamily: string
  fontWeight?: string
  lineHeight?: number
  textAlign?: TextAlign | string
  valign?: VerticalAlign | string

  imageUri?: string
  imageFit?: string

  constructor(init: LayerInit = {}) {
    this.id = init.id || Layer.generateId();
    this.fontFamily = 'Roboto';
    this.fontSize = 14;

    Object.assign(this, init);
  }

  setAttribue(key: keyof LayerInit, value: any) {
    switch(key) {
      case 'x':
      case 'y':
      case 'width':
      case 'height':
      case 'fontSize':
      case 'lineHeight':
      case 'order':
        this[key] = parseInt(value);
        break;
      default:
        this[key] = value.toString();
        break;
    }
  }

  get type(): LayerType {
    if (this.text && this.imageUri) {
      return LayerType.ImageAndText;
    }

    if (this.text) {
      return LayerType.Text;
    }

    if (this.imageUri) {
      return LayerType.Image;
    }

    return LayerType.Empty;
  }

  toSearchString() {
    const { order } = this;
    const items: string[] = [];

    serializeableAttributes.forEach(attr => {
      if (this[attr] !== undefined) {
        items.push(`${order}.${attr}=${this[attr]!.toString()}`)
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