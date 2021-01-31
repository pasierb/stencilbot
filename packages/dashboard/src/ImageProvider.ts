export class ImageProvider {
  private cache: {[uri: string]: Promise<HTMLImageElement>} = {};

  load(uri: string) {
    if (!this.cache[uri]) {
      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const imageElement: HTMLImageElement = new Image();

        imageElement.onload = () => resolve(imageElement)
        imageElement.onerror = reject;
        imageElement.src = uri;
      });

      this.cache[uri] = promise;
    }

    return this.cache[uri];
  }
}

const instance = new ImageProvider();

export default instance;
