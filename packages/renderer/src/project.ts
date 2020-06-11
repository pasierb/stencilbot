import { Layer } from './layer';

export class Project {
  width: number
  height: number
  layers: Layer[] 

  constructor(width: number, height: number, layers?: Layer[]) {
    this.width = +width;
    this.height = +height;
    this.layers = layers || [];
  }

  static fromSearchParams(input: {[key: string]: string}): Project {
    const width = input['w'];
    const height = input['h'];

    if (!width || !height) {
      throw new Error('`w` and/or `h` params are missing')
    }

    const layers = Layer.fromSearchParams(input);

    return new Project(+width, +height, layers);
  }

  toSearchString() {
    return [
      `w=${this.width}`,
      `h=${this.height}`,
      ...this.layers.map(l => l.toSearchString())
    ].join('&');
  }
}
