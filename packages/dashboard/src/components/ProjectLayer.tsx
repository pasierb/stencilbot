import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Layer } from '@stencilbot/renderer';
import { BrowserRenderer } from '../BrowserRenderer';
import { fontLoader } from '../fontLoader';
// import webfontloader from 'webfontloader';

interface ProjectLayerProps {
  layer: Layer
  width: number
  height: number
}

const renderer = new BrowserRenderer();

const ProjectLayer: FunctionComponent<ProjectLayerProps> = ({ layer, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const trigger = fontLoader.on(layer.fontFamily, () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')!;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        renderer.render(canvasRef.current, layer);
      }
    })

    fontLoader.load(layer.fontFamily)

    return trigger;
  });

  return (
    <canvas width={width} height={height} ref={canvasRef} />
  );
}

export { ProjectLayer };
