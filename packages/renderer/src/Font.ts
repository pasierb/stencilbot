const fontVariantRegExp = /^(\d{3})?(\w+)?$/

export class Font {
  public readonly family: string;
  public readonly variant: string;

  constructor(input: string) {
    const [family, variant] = input.split(":");

    this.family = family;
    this.variant = variant;
  }

  get weight(): string {
    const match = this.variant.match(fontVariantRegExp);

    return (match && match[1]) || "";
  }

  get style(): string  {
    const match = this.variant.match(fontVariantRegExp);
    let style = (match && match[2]) || "";

    if (style === "regular") {
      style = "";
    }

    return style;
  }

  get fileName() {
    return `${[this.family, this.variant].join('-')}.ttf`
  }
}
