import React, { FunctionComponent } from 'react';
import { BoldOutlined, PictureOutlined } from '@ant-design/icons';
import { Layer, LayerType } from '@stencilbot/renderer';

export const LayerIcon: FunctionComponent<{ layer: Layer }> = ({ layer }) => {
  switch (layer.type) {
    case LayerType.Text: {
      return <BoldOutlined />;
    }
    case LayerType.Image: {
      return <PictureOutlined />
    }
    case LayerType.ImageAndText: {
      return (<span>
        <PictureOutlined />
        <BoldOutlined />
      </span>)
    }
    default: {
      return <span />
    }
  }
}
