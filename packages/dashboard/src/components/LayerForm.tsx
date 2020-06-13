import React, { FunctionComponent, Fragment, useState } from 'react';
import { Layer, LayerInit, ImageFit, VerticalAlign, TextAlign } from '@stencilbot/renderer';
import { Form, Input, Button, Select, Row, Col, Radio } from 'antd';
import { debounce } from 'lodash';
import { GoogleFontSelect } from './GoogleFontSelect';
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined, VerticalAlignMiddleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
  onRemove: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit, onRemove }) => {
  const [edit, updateEdit] = useState<Layer>(layer);

  const submit = debounce(() => {
    onSubmit(edit);
  }, 200);

  const handleChange = (key: keyof LayerInit, value) => {
    edit.setAttribue(key, value);
    const newLayer = new Layer({ ...edit, id: layer.id, order: layer.order });
    updateEdit(newLayer);

    submit();
  }

  function handleRemove() {
    onRemove(layer);
  }

  return (
    <Form onFinish={() => submit()} size="small" wrapperCol={{ span: 16 }} labelCol={{ span: 8 }}>
      <Row>
        <Col span={12}>
          <Form.Item label="x">
            <Input type="number" onChange={(e) => handleChange('x', e.target.value)} defaultValue={layer.x} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="y">
            <Input type="number" onChange={(e) => handleChange('y', e.target.value)} defaultValue={layer.y} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="w">
            <Input type="number" onChange={(e) => handleChange('w', e.target.value)} defaultValue={layer.w} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="h">
            <Input type="number" onChange={(e) => handleChange('h', e.target.value)} defaultValue={layer.h} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Text">
        <Input.TextArea onChange={(e) => handleChange('txt', e.target.value)} defaultValue={layer.txt} />
      </Form.Item>

      {layer.txt && (<Fragment>
        <Form.Item label="Font family">
          <GoogleFontSelect
            onChange={(v) => handleChange('font', v.value)}
            defaultValue={layer.fontFamily}
          />
        </Form.Item>
        <Form.Item label="Font size">
          <Input type="number" onChange={(e) => handleChange('fontSize', e.target.value)} defaultValue={layer.fontSize} />
        </Form.Item>
        <Form.Item label="Line height">
          <Input type="number" step={0.1} onChange={(e) => handleChange('lineH', e.target.value)} defaultValue={layer.lineH || 1} />
        </Form.Item>
        <Form.Item label="Color">
          <Input type="color" onChange={(e) => handleChange('color', e.target.value)} defaultValue={layer.color} />
        </Form.Item>
      </Fragment>)}
      <Form.Item label="Image">
        <Input onChange={(e) => handleChange('img', e.target.value)} defaultValue={layer.img} />
      </Form.Item>

      {layer.img && (<Fragment>
        <Form.Item label="Image fit">
          <Radio.Group defaultValue={layer.imgFit} onChange={e => handleChange('imgFit', e.target.value)}>
            <Radio.Button value={undefined}>none</Radio.Button>
            <Radio.Button value={ImageFit.Contain}>contain</Radio.Button>
            <Radio.Button value={ImageFit.Cover}>cover</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Fragment>)}

      <Form.Item label="Vertical align">
        <Radio.Group onChange={e => handleChange('valign', e.target.value)} defaultValue={layer.valign || VerticalAlign.Top}>
          <Radio.Button value={VerticalAlign.Top}>
            <VerticalAlignTopOutlined />
          </Radio.Button>
          <Radio.Button value={VerticalAlign.Middle}>
            <VerticalAlignMiddleOutlined />
          </Radio.Button>
          <Radio.Button value={VerticalAlign.Bottom}>
            <VerticalAlignBottomOutlined />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Text align">
        <Radio.Group defaultValue={layer.txtAlign || TextAlign.Left} onChange={e => handleChange('txtAlign', e.target.value)}>
          <Radio.Button value={TextAlign.Left}>
            <AlignLeftOutlined />
          </Radio.Button>
          <Radio.Button value={TextAlign.Center}>
            <AlignCenterOutlined />
          </Radio.Button>
          <Radio.Button value={TextAlign.Right}>
            <AlignRightOutlined />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
      <Button onClick={handleRemove}>Remove</Button>
    </Form>
  );
}