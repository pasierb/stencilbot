import fetch from 'node-fetch';

const localCache = new Map<string, Promise<Buffer>>();

export function fetchImage(uri: string) {
  if (localCache.get(uri)) {
    return localCache.get(uri);
  }

  const promise = fetch(uri).then(r => r.buffer());

  localCache.set(uri, promise);

  return promise;
}
