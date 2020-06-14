import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Layer } from '@stencilbot/renderer';
import { BrowserRenderer } from '../BrowserRenderer';
import { fontLoader } from '../fontLoader';

interface ProjectLayerProps {
  layer: Layer
  width: number
  height: number
}

const renderer = new BrowserRenderer();

const ProjectLayer: FunctionComponent<ProjectLayerProps> = ({ layer, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;

    const trigger = fontLoader.on(layer.fontFamily, () => {
      if (canvasRef.current) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        renderer.render(canvasRef.current, layer);
      }
    })

    if (layer.fontFamily) {
      fontLoader.load(layer.fontFamily)
    }

    renderer.render(canvasRef.current!, layer);
    return trigger;
  });

  return (
    <canvas width={width} height={height} ref={canvasRef} />
  );
}

export { ProjectLayer };
