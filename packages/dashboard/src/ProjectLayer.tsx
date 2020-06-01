import React, { useRef, useEffect, FunctionComponent } from 'react';
import { Subject } from 'rxjs';
import { Layer } from '@cardstamp/renderer';
import { BrowserRenderer } from './BrowserRenderer';

interface ProjectLayerProps {
  layer: Subject<Layer>
  width: number
  height: number
}

const renderer = new BrowserRenderer();

const ProjectLayer: FunctionComponent<ProjectLayerProps> = ({ layer, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sub = layer.subscribe(l => {
      renderer.render(canvasRef.current!, l);
    });

    return sub.unsubscribe
  });

  return (
    <canvas width={width} height={height} ref={canvasRef} />
  );
}

export { ProjectLayer };
