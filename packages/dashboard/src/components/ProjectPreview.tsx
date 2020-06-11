import React, { FunctionComponent } from 'react';
import { Layer } from '@stencilbot/renderer';
import { ProjectLayer } from './ProjectLayer';
import { ProjectLayerOutline } from './ProjectLayerOutline';

import style from './Project.module.css';

interface ProjectProps {
  width: number
  height: number
  layers: Layer[]
  selectedLayerId?: string
}

export const ProjectPreview: FunctionComponent<ProjectProps> = ({ width, height, layers, selectedLayerId }) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className={style.Project} style={{ width: `${width}px`, height: `${height}px` }}>
      {layers.map((layer) =>
        <ProjectLayer
          key={layer.id + '-canvas'}
          layer={layer}
          width={width}
          height={height}
        />
      )}

      {selectedLayer && (
        <ProjectLayerOutline
          key={selectedLayer.id + '-outline'}
          layer={selectedLayer}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}