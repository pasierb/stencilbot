import React, { Fragment, FunctionComponent, useState } from 'react';
import { Layout, Collapse, Button } from 'antd';
import { useRecoilState } from 'recoil';
import { Layer } from '@stencilbot/renderer';

import { editorLayers, editorProject } from '../atoms';

import { Project } from './Project';
import { LayerForm } from './LayerForm';
import { LayerIcon } from './LayerIcon';

import style from './Editor.module.css';

const PanelHeader: FunctionComponent<{ layer: Layer }> = ({ layer }) => (
  <Fragment>
    <LayerIcon layer={layer} />
    <span>{layer.id}</span>
  </Fragment>
);

export const Editor = () => {
  const [layers, setLayers] = useRecoilState(editorLayers);
  const [project, setProject] = useRecoilState(editorProject);
  const [selectedLayerId, setSelectedLayerId] = useState<string>();

  const handleSubmit = (layer: Layer) => {
    const i = layers.findIndex(({ id }) => id === layer.id);

    if (i !== -1) {
      const newLayers = [...layers];
      newLayers[i] = layer;

      setLayers(newLayers);
    }
  }

  const handleRemove = (layer: Layer) => {
    const i = layers.findIndex(({ id }) => id === layer.id);

    setLayers([...layers.slice(0, i), ...layers.slice(i+1)]);
  }

  const handleGetLink = () => {
    const query = [
      `w=${project.width}`,
      `h=${project.height}`,
      ...layers.map(l => l.toSearchString())
    ].join('&');

    window.location.search = query;
    console.log(query);
  }

  const handleAddLayer = () => {
    const order = Math.max(-1, ...layers.map(l => l.order || 0)) + 1
    const newLayer = new Layer({ order });

    setLayers([...layers, newLayer]);
  }

  return (
    <Layout className={style.Editor}>
      <Layout.Content>
        <Project
          layers={layers}
          width={project.width}
          height={project.height}
          selectedLayerId={selectedLayerId}
        />
      </Layout.Content>

      <Layout.Sider>
        <Button onClick={handleGetLink}>Link</Button>

        <Collapse accordion onChange={(id) => setSelectedLayerId(id as string)}>
          {layers.map((layer, i) => (
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
