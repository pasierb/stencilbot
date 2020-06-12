import { Renderer, Project } from '@stencilbot/renderer';
import { createCanvas, loadImage, Canvas } from 'canvas';
import fetch from 'node-fetch';
import { registerGoogleFont } from './fonts';
import { fetchImage } from './images';

export class ServerRenderer extends Renderer {
  loadImage(uri: string) {
    return fetchImage(uri)
      .then(buf => loadImage(buf) as unknown as CanvasImageSource)
  }

  preloadImages(project: Project) {
    project.layers.forEach(({ imageUri }) => {
      if (imageUri) {
        fetchImage(imageUri);
      }
    });
  }

  registerProjectFonts(project: Project) {
    const fontFamilies = new Set<string>();

    project.layers.forEach(({ fontFamily }) => {
      if (fontFamily && fontFamily.indexOf(':') > 0) {
        fontFamilies.add(fontFamily)
      }
    });

    return Promise.all([...fontFamilies].map(fontFamily => {
      return registerGoogleFont(fontFamily);
    }));
  }

  async renderProject(project: Project): Promise<Canvas> {
    this.preloadImages(project);
    await this.registerProjectFonts(project);

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
