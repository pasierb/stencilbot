export class FontProvider {
  private loading: {[key: string]: Promise<unknown>} = {};
  private loaded: Set<string> = new Set();

  load(family: string) {
    if (this.loaded.has(family)) {
      return Promise.resolve(null);
    }

    if (this.loading[family]) {
      return this.loading[family];
    }

    return new Promise((resolve) => {
      global.WebFont.load({
        google: {
          families: [family]
        },
        fontactive: (family) => {
          if (family === family) {
            resolve(null);
            this.loaded.add(family);
            delete this.loading[family];
          }
        },
      });
    });
  }
}

const instance = new FontProvider();

export default instance;
