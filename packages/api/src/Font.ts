interface FontInit {
  family: string;
  weight?: string;
  style?: string;
}

export class Font {
  public readonly family;
  public readonly weight;
  public readonly style;

  constructor(init: FontInit) {
    this.family = init.family;
    this.weight = init.weight;
    this.style = init.style;
  }

  get key() {
    return [this.family, this.weight, this.style]
      .filter(v => !!v)
      .join("");
  }
}
