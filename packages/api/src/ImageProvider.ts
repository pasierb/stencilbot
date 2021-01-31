import fetch from 'node-fetch';

export class ImageProvider {
  cache: {[key: string]: Promise<Buffer>} = {};

  load(uri: string): Promise<Buffer> {
    console.log(`Loading `, uri)

    if (!this.cache[uri]) {
      const result = fetch(uri)
        .then(r => {
          console.log(`Loaded `, uri);

          return r.buffer();
        })
        .catch(err => {
          console.error(`Failed to load image:`, err);
          delete this.cache[uri];

          throw err;
        });

      this.cache[uri] = result;
    }

    return this.cache[uri];
  }
}
