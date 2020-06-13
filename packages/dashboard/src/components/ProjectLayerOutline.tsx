import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Layer } from '@stencilbot/renderer';

interface ProjectLayerOutlineProps {
  layer: Layer
  width: number
  height: number
}

const ProjectLayerOutline: FunctionComponent<ProjectLayerOutlineProps> = ({ width, height, layer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d');

    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx?.strokeRect(
      layer.x || 0,
      layer.y || 0,
      layer.w || width,
      layer.h || height,
    );
  });

  return (
    <canvas width={width} height={height} ref={canvasRef} />
  )
}

export { ProjectLayerOutline };
