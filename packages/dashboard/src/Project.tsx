import React, { FunctionComponent } from 'react';
import { ProjectLayer } from './ProjectLayer';
import { Layer } from '@cardstamp/renderer';

import style from './Project.module.css';

interface ProjectProps {
    project: {
        width: number,
        height: number,
        layers: Layer[]
    }
}

export const Project: FunctionComponent<ProjectProps> = ({ project }) => {
    const { layers, width, height } = project;

    return (
        <div className={style.Project}>
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