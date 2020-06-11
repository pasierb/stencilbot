import { Renderer, Project } from '@stencilbot/renderer';
import { createCanvas, loadImage, Canvas } from 'canvas';
import fetch from 'node-fetch';

export class ServerRenderer extends Renderer {
  loadImage(uri: string) {
    return fetch(uri)
      .then(res => res.buffer())
      .then(buf => loadImage(buf) as unknown as CanvasImageSource)
  }

  async renderProject(project: Project): Promise<Canvas> {
    const base = createCanvas(project.width, project.height);
    const ctx = base.getContext('2d');

    const canvasLayers = await Promise.all(project.layers.map(layer => new Promise<Canvas>((resolve, reject) => {
      const canvas = createCanvas(project.width, project.height);

      this.render(canvas as unknown as HTMLCanvasElement, layer)
        .then(() => resolve(canvas))
        .catch(reject);
    })));

    canvasLayers.forEach((canvas) => {
      ctx.drawImage(canvas, 0, 0, project.width, project.height);
    });

    return base;
  }
}
