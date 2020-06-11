import webfontloader from 'webfontloader';

class FontLoader {
  loaded: Set<string>
  loading: Map<string, boolean>
  eventListeneres: Map<string, Set<Function>>

  constructor() {
    this.loaded = new Set();
    this.loading = new Map();
    this.eventListeneres = new Map();
  }

  on(fontFamily, callback) {
    const arr = this.eventListeneres.get(fontFamily) || new Set();

    arr.add(callback);
    this.eventListeneres.set(fontFamily, arr);

    return () => this.off(fontFamily, callback);
  }

  off(fontFamily, callback) {
    const arr = this.eventListeneres.get(fontFamily) || new Set();

    arr.delete(callback);
    this.eventListeneres.set(fontFamily, arr);
  }

  trigger(fontFamily) {
    const listeners = this.eventListeneres.get(fontFamily);

    if (listeners && listeners.size > 0) {
      listeners.forEach(cb => cb());
    }
  }

  load(fontFamily: string) {
    if (this.loaded.has(fontFamily) || this.loading.get(fontFamily)){
      this.trigger(fontFamily);
      return;
    }

    this.loading.set(fontFamily, true);
    webfontloader.load({
      google: {
        families: [fontFamily]
      },
      fontactive: (fontFamily) => {
        this.loaded.add(fontFamily);
        this.loading.delete(fontFamily);
        this.trigger(fontFamily);
      }
    });
  }
}

const fontLoader = new FontLoader();

export { fontLoader };
