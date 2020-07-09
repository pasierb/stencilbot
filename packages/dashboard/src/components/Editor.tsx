import React, { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/router'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Layout, Collapse, Button, Card, Input, Form } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EyeOutlined, ZoomInOutlined, UndoOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Layer, LayerType, Project } from '@stencilbot/renderer';
import { ProjectPreview } from './ProjectPreview';
import { LayerForm } from './LayerForm';
import { ProjectForm } from './ProjectForm';

import style from './Editor.module.css';

const siderWidth = 300; //px

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
  const router = useRouter();

  const handleProjectChange = (project: Project) => {
    router.push(`/projects/edit?${project.toSearchString()}`);
    setProject(project);
  }

  const handleChangeLayer = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    if (i !== -1) {
      const newLayers = [...project.layers];
      newLayers[i] = layer;
      const newProject = new Project(project.width, project.height, newLayers)

      router.push(`/projects/edit?${newProject.toSearchString()}`);
      setProject(newProject);
    }
  }

  const handleRemoveLayer = (layer: Layer) => {
    const i = project.layers.findIndex(({ id }) => id === layer.id);

    const newLayers = [...project.layers.slice(0, i), ...project.layers.slice(i+1)];
    const newProject = new Project(project.width, project.height, newLayers)

    router.push(`/projects/edit?${newProject.toSearchString()}`);
    setProject(newProject);
  }

  const handleAddLayer = () => {
    const order = Math.max(-1, ...project.layers.map(l => l.order || 0)) + 1
    const newLayer = new Layer({ order });
    const newLayers = [...project.layers, newLayer];
    const newProject = new Project(project.width, project.height, newLayers)

    router.push(`/projects/edit?${newProject.toSearchString()}`);
    setProject(newProject);
  }

  const handlePromoteLayer = (layer: Layer) => {
    const { layers } = project;

    const i = layers.findIndex(l => l.id === layer.id);
    if (i === layers.length -  1) {
      return;
    }

    [layers[i+1], layers[i]] = [layers[i], layers[i+1]];
    layers.forEach((l, i) => {
      l.order = i;
    });

    setProject(new Project(project.width, project.height, layers));
  }

  const handleDemoteLayer = (layer: Layer) => {
    const { layers } = project;

    const i = layers.findIndex(l => l.id === layer.id);
    if (i === 0) {
      return;
    }

    [layers[i-1], layers[i]] = [layers[i], layers[i-1]];
    layers.forEach((l, i) => {
      l.order = i;
    });

    setProject(new Project(project.width, project.height, layers));
  }

  const handlePreview = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_HOST}/project?${project.toSearchString()}`,
      '_stencilbot_preview'
    );
  }

  const handleBack = () => {
    router.push('/');
  }

  return (
    <Layout className={style.Editor}>
      <TransformWrapper
        defaultScale={1}
        options={{
          minScale: 0,
          centerContent: true,
          limitToBounds: false
        }}
      >
        {({ resetTransform, zoomIn, zoomOut, scale }) => (
          <React.Fragment>
            <Layout.Content>
              <TransformComponent>
                <div className={style.workbench}>
                  <ProjectPreview
                    layers={project.layers}
                    width={project.width}
                    height={project.height}
                    selectedLayerId={selectedLayerId}
                  />
                </div>
              </TransformComponent>

              <Button size="large" className={style.backButton} onClick={handleBack}>
                <ArrowLeftOutlined />
              </Button>

              <div className={style.zoomControl}>
                <Form layout="inline">
                  <Form.Item>
                    <Input.Group style={{ display: 'flex' }}>
                      <Button
                        icon={<ZoomOutOutlined />}
                        size="large"
                        onClick={zoomOut}
                      />
                      <Input
                        disabled
                        style={{ width: '7em' }}
                        type="number"
                        value={(scale * 100).toFixed(1)}
                        suffix="%"
                        size="large"
                      />
                      <Button
                        icon={<ZoomInOutlined />}
                        size="large"
                        onClick={zoomIn}
                      />
                    </Input.Group>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={resetTransform}
                      size="large"
                      icon={<UndoOutlined />}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Layout.Content>

            <Layout.Sider width={siderWidth} collapsible>
              <Card title="Project" size="small" style={{ minWidth: siderWidth * .8 }}>
                <ProjectForm project={project} onSubmit={handleProjectChange} />

                <Button onClick={handlePreview} title="See preview" icon={<EyeOutlined />}>
                  Preview 
                </Button>
              </Card>
              <Card
                title={`Layers (${project.layers.length})`}
                size="small"
                style={{ minWidth: siderWidth * .8 }}
                extra={
                  <Button onClick={handleAddLayer} title="Add layer">
                    <PlusOutlined />
                  </Button>
                }
              >
                <Collapse accordion onChange={(id) => setSelectedLayerId(id as string)}>
                  {[...project.layers].reverse().map((layer) => (
                    <Collapse.Panel key={layer.id} header={<PanelHeader layer={layer} />}>
                      <LayerForm
                        key={layer.id + '-form'}
                        layer={layer}
                        onSubmit={handleChangeLayer}
                        onRemove={handleRemoveLayer}
                        onPromote={handlePromoteLayer}
                        onDemote={handleDemoteLayer}
                      />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Card>
            </Layout.Sider>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Layout>
  )
}
