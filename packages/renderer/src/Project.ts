import { Layer } from './Layer';

export class Project {
  constructor(public width: number, public height: number, public layers: Layer[] = []) {}

  static fromSearchParams(input: {[key: string]: string}): Project {
    const width = input['w'];
    const height = input['h'];

    if (!width || !height) {
      throw new Error('`w` and/or `h` params are missing')
    }

    const layers = Layer.fromSearchParams(input);

    return new Project(+width, +height, layers);
  }

  toSearchString(): string {
    return [
      `w=${this.width}`,
      `h=${this.height}`,
      ...this.layers.map(l => l.toSearchString())
    ].join('&');
  }
}
