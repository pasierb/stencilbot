import React, { FunctionComponent, useState } from 'react';
import { Layout, Collapse, Button, Card } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Layer, LayerType, Project } from '@stencilbot/renderer';
import { navigate } from '@reach/router';
import { ProjectPreview } from './ProjectPreview';
import { LayerForm } from './LayerForm';
import { ProjectForm } from './ProjectForm';

import style from './Editor.module.css';

const PanelHeader: FunctionComponent<{ layer: Layer }> = ({ layer }) => (
  <div>
    {layer.type === LayerType.Text && (
      <span>{layer.txt}</span>
    )}
    {layer.type === LayerType.Image && (
      <img src={layer.img} height="40" alt="preview" />
    )}
  </div>
);

interface EditorProps {
  project: Project
}

export const Editor: FunctionComponent<EditorProps> = (props) => {
  const [project, setProject] = useState<Project>(props.project);
  const [selectedLayerId, setSelectedLayerId] = useState<string>();

  const handleProjectChange = (project: Project) => {
    setProject(project);
  }

  const handleChangeLayer = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    if (i !== -1) {
      const newLayers = [...project.layers];
      newLayers[i] = layer;

      setProject(new Project(project.width, project.height, newLayers));
    }
  }

  const handleRemoveLayer = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    const newLayers = [...project.layers.slice(0, i), ...project.layers.slice(i+1)];
    setProject(new Project(project.width, project.height, newLayers));
  }

  const handleAddLayer = () => {
    const order = Math.max(-1, ...project.layers.map(l => l.order || 0)) + 1
    const newLayer = new Layer({ order });
    const newLayers = [...project.layers, newLayer];

    setProject(new Project(project.width, project.height, newLayers));
  }

  const handlePreview = () => {
    window.open(
      `https://cdn.stencilbot.io/v1/project?${project.toSearchString()}`,
      '_stencilbot_preview'
    );
  }

  const handleBack = () => {
    navigate('/');
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

        <Button size="large" className={style.backButton} onClick={handleBack}>
          <ArrowLeftOutlined />
        </Button>
      </Layout.Content>

      <Layout.Sider width="300" theme="dark">
        <Card title="Project" size="small">
          <ProjectForm project={project} onSubmit={handleProjectChange} />

          <Button onClick={handlePreview} title="See preview" icon={<EyeOutlined />}>
            Preview 
          </Button>
        </Card>
        <Card
          title="Layers"
          size="small"
          extra={
            <Button onClick={handleAddLayer} title="Add layer">
              <PlusOutlined />
            </Button>
          }
        >
          <Collapse accordion onChange={(id) => setSelectedLayerId(id as string)}>
            {project.layers.map((layer, i) => (
              <Collapse.Panel key={layer.id} header={<PanelHeader layer={layer} />}>
                <LayerForm
                  key={layer.id + '-form'}
                  layer={layer}
                  onSubmit={handleChangeLayer}
                  onRemove={handleRemoveLayer}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Card>
      </Layout.Sider>
    </Layout>
  )
}
