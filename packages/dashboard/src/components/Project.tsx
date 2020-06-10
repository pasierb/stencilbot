import React, { Fragment, FunctionComponent } from 'react';
import { Layer } from '@stencilbot/renderer';
import { ProjectLayer } from './ProjectLayer';
import { ProjectLayerOutline } from './ProjectLayerOutline';

import style from './Project.module.css';

interface ProjectProps {
  width: number
  height: number
  layers: Layer[]
  showOutline?: boolean
}

export const Project: FunctionComponent<ProjectProps> = ({ width, height, layers, showOutline }) => {
  return (
    <div className={style.Project} style={{ width: `${width}px`, height: `${height}px` }}>
      {layers.map((layer, i) =>
        <Fragment>
          <ProjectLayer
            key={i}
            layer={layer}
            width={width}
            height={height}
          />
          {showOutline && (
            <ProjectLayerOutline
              key={i-1000}
              layer={layer}
              width={width}
              height={height}
            />
          )}
        </Fragment>
      )}
    </div>
  )
}