import React, { FunctionComponent } from 'react';
import { ProjectLayer } from './ProjectLayer';
import { Layer } from '@cardstamp/renderer';
import { Subject } from 'rxjs';

import style from './Project.module.css';

interface ProjectProps {
  width: number,
  height: number,
  layers: Subject<Layer>[]
}

export const Project: FunctionComponent<ProjectProps> = ({ width, height, layers }) => {
  return (
    <div className={style.Project} style={{ width: `${width}px`, height: `${height}px` }}>
      {layers.map((layer, i) =>
        <ProjectLayer
          key={i}
          layer={layer}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}