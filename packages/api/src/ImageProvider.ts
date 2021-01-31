import fetch from 'node-fetch';

export class ImageProvider {
  cache: Map<string, Promise<Buffer>> = new Map();

  load(uri: string) {
    if (!this.cache.has(uri)) {
      const result = fetch(uri)
        .then(r => r.buffer())
        .catch(err => {
          console.error(`Failed to load image:`, err);
          this.cache.delete(uri);

          throw err;
        });

      this.cache.set(uri, result);
    }

    return this.cache.get(uri);
  }
}
