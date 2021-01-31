import React, { FC, useRef, useEffect } from 'react';
import { Project } from '@stencilbot/renderer';
import { BrowserRenderer } from "../BrowserRenderer";

import style from './Project.module.css';

interface ProjectProps {
  project: Project;
}

export const ProjectPreview: FC<ProjectProps> = ({ project }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = new BrowserRenderer(project, containerRef.current!);

    renderer.render();
  });

  return (
    <div ref={containerRef} className={style.Project} style={{ width: `${project.width}px`, height: `${project.height}px` }}>
      {project.layers.map((layer) =>
        <canvas key={layer.order!} width={project.width} height={project.height} />
      )}
    </div>
  )
}