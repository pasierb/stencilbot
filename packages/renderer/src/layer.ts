export type LayerInit = {
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
  color?: string
}

export enum ImageFit {
  Cover = 'cover',
  Contain = 'contain',
  None = 'none'
}

export class Layer {
  order: number
  x: number
  y: number
  width?: number
  height?: number

  text: string
  color: string
  fontUri?: string
  fontSize: number
  fontFamily: string

  imageUri?: string
  imageFit: string

  constructor(init: LayerInit = {}) {
    this.order = init.order || -1;
    this.x = init.x || 0;
    this.y = init.y || 0;
    this.text = init.text || '';
    this.color = init.color || '#000';
    this.fontFamily = init.fontFamily || 'Roboto';
    this.fontSize = init.fontSize || 14;
    this.imageUri = init.imageUri;
    this.imageFit = init.imageFit || ImageFit.None;
  }

  set attributes(init: LayerInit) {
    Object.assign(this, init);
  }

  get attributes(): LayerInit {
    return {
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
}