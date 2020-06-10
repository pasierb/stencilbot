import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Layer } from '@stencilbot/renderer';
import { BrowserRenderer } from '../BrowserRenderer';

interface ProjectLayerProps {
  layer: Layer
  width: number
  height: number
}

const renderer = new BrowserRenderer();

const ProjectLayer: FunctionComponent<ProjectLayerProps> = ({ layer, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    renderer.render(canvasRef.current!, layer);
  });

  return (
    <canvas width={width} height={height} ref={canvasRef} />
  );
}

export { ProjectLayer };
