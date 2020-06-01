import { Renderer, Layer } from '@stencilbot/renderer';
import { loadImage, Image } from 'canvas';
import fetch from 'node-fetch';

export class ServerRenderer extends Renderer {
  loadImage(uri: string) {
    return fetch(uri)
      .then(res => res.buffer())
      .then(buf => loadImage(buf) as unknown as CanvasImageSource)
  }
}
