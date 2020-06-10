import React, { Fragment, FunctionComponent } from 'react';
import { Layout, Collapse } from 'antd';
import { useRecoilState } from 'recoil';
import { Layer } from '@stencilbot/renderer';

import { editorLayers } from '../atoms';

import { Project } from './Project';
import { LayerForm } from './LayerForm';
import { LayerIcon } from './LayerIcon';

import style from './Editor.module.css';

const width = 800;
const height = 400;

const PanelHeader: FunctionComponent<{ layer: Layer }> = ({ layer }) => (
  <Fragment>
    <LayerIcon layer={layer} />
    <span>{layer.id}</span>
  </Fragment>
);

export const Editor = () => {
  const [layers, updateEditorLayers] = useRecoilState(editorLayers);

  const handleSubmit = (layer: Layer) => {
    const i = layers.findIndex(({ id }) => id === layer.id);

    if (i !== -1) {
      const newLayers = [...layers];
      newLayers[i] = layer;

      updateEditorLayers(newLayers);
    }
  }

  

  return (
    <Layout className={style.Editor}>
      <Layout.Content>
        <Project
          layers={layers}
          width={width}
          height={height}
        />
      </Layout.Content>
      <Layout.Sider>
        <Collapse accordion>
          {layers.map((layer, i) => (
            <Collapse.Panel key={layer.id} header={<PanelHeader layer={layer} />}>
              <LayerForm
                key={i}
                layer={layer}
                onSubmit={handleSubmit}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Layout.Sider>
    </Layout>
  )
}
