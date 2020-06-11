import React, { Fragment, FunctionComponent, useState } from 'react';
import { Layout, Collapse, Button } from 'antd';
import { Layer, Project } from '@stencilbot/renderer';

import { ProjectPreview } from './ProjectPreview';
import { LayerForm } from './LayerForm';
import { LayerIcon } from './LayerIcon';

import style from './Editor.module.css';

const PanelHeader: FunctionComponent<{ layer: Layer }> = ({ layer }) => (
  <Fragment>
    <LayerIcon layer={layer} />
    <span>{layer.id}</span>
  </Fragment>
);

interface EditorProps {
  project: Project
}

export const Editor: FunctionComponent<EditorProps> = (props) => {
  const [project, setProject] = useState<Project>(props.project);
  const [selectedLayerId, setSelectedLayerId] = useState<string>();

  const handleSubmit = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    if (i !== -1) {
      const newLayers = [...project.layers];
      newLayers[i] = layer;

      setProject(new Project(project.width, project.height, newLayers));
    }
  }

  const handleRemove = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    const newLayers = [...project.layers.slice(0, i), ...project.layers.slice(i+1)];
    setProject(new Project(project.width, project.height, newLayers));
  }

  const handleGetLink = () => {
    const query = project.toSearchString();

    window.location.search = query;
  }

  const handleAddLayer = () => {
    const order = Math.max(-1, ...project.layers.map(l => l.order || 0)) + 1
    const newLayer = new Layer({ order });
    const newLayers = [...project.layers, newLayer];

    setProject(new Project(project.width, project.height, newLayers));
  }

  return (
    <Layout className={style.Editor}>
      <Layout.Content>
        <ProjectPreview
          layers={project.layers}
          width={project.width}
          height={project.height}
          selectedLayerId={selectedLayerId}
        />
      </Layout.Content>

      <Layout.Sider>
        <Button onClick={handleGetLink}>Link</Button>

        <Collapse accordion onChange={(id) => setSelectedLayerId(id as string)}>
          {project.layers.map((layer, i) => (
            <Collapse.Panel key={layer.id} header={<PanelHeader layer={layer} />}>
              <LayerForm
                key={layer.id + '-form'}
                layer={layer}
                onSubmit={handleSubmit}
                onRemove={handleRemove}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
        <Button onClick={handleAddLayer}>Add</Button>
      </Layout.Sider>
    </Layout>
  )
}
