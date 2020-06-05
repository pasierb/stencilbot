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
  lineHeight?: number
  color?: string
}

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain',
  None = 'none'
}

export enum LayerType {
  Empty,
  Text,
  Image,
  ImageAndText
}

export class Layer {
  id: string
  order: number
  x: number
  y: number
  width: number
  height: number

  text: string
  color: string
  fontUri: string
  fontSize: number
  fontFamily: string
  lineHeight: number

  imageUri: string
  imageFit: string

  constructor(init: LayerInit = {}) {
    this.id = init.id || Layer.generateId();
    this.order = init.order || -1;
    this.x = init.x || 0;
    this.y = init.y || 0;
    this.text = init.text || '';
    this.color = init.color || '#000';
    this.fontFamily = init.fontFamily || 'Roboto';
    this.fontSize = init.fontSize || 14;
    this.lineHeight = init.lineHeight || 1;
    this.imageUri = init.imageUri || '';
    this.imageFit = init.imageFit || ImageFit.None;
    this.width = init.width || 0;
    this.height = init.height || 0;
    this.fontUri = init.fontUri || '';
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

  set attributes(init: LayerInit) {
    Object.assign(this, init);
  }

  get attributes(): LayerInit {
    return {
      id: this.id,
      order: this.order,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      text: this.text,
      color: this.color,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontUri: this.fontUri,
      imageFit: this.imageFit,
      imageUri: this.imageUri
    };
  }

  static generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}