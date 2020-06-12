import React, { FunctionComponent, Fragment, useState } from 'react';
import { Layer, LayerInit, ImageFit, VerticalAlign, TextAlign } from '@stencilbot/renderer';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { debounce } from 'lodash';
import { GoogleFontSelect } from './GoogleFontSelect';

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
    <Form onFinish={() => submit()} size="small" layout="horizontal">
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
            <Input type="number" onChange={(e) => handleChange('width', e.target.value)} defaultValue={layer.width} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="h">
            <Input type="number" onChange={(e) => handleChange('height', e.target.value)} defaultValue={layer.height} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Text">
        <Input.TextArea onChange={(e) => handleChange('text', e.target.value)} defaultValue={layer.text} />
      </Form.Item>

      {layer.text && (<Fragment>
        <Form.Item label="Font family">
          <GoogleFontSelect
            onChange={(v) => handleChange('fontFamily', v.value)}
            defaultValue={layer.fontFamily}
          />
        </Form.Item>
        <Form.Item label="Font size">
          <Input type="number" onChange={(e) => handleChange('fontSize', e.target.value)} defaultValue={layer.fontSize} />
        </Form.Item>
        <Form.Item label="Font weight">
          <Input onChange={(e) => handleChange('fontWeight', e.target.value)} defaultValue={layer.fontWeight} />
        </Form.Item>
        <Form.Item label="Line height">
          <Input type="number" onChange={(e) => handleChange('lineHeight', e.target.value)} defaultValue={layer.lineHeight} />
        </Form.Item>
        <Form.Item label="Color">
          <Input type="color" onChange={(e) => handleChange('color', e.target.value)} defaultValue={layer.color} />
        </Form.Item>
      </Fragment>)}
      <Form.Item label="Image">
        <Input onChange={(e) => handleChange('imageUri', e.target.value)} defaultValue={layer.imageUri} />
      </Form.Item>

      {layer.imageUri && (<Fragment>
        <Form.Item label="Image fit">
          <Select
            defaultValue={layer.imageFit}
            onChange={(val) => handleChange('imageFit', val.toString())}
            options={[
              { value: ImageFit.None },
              { value: ImageFit.Contain },
              { value: ImageFit.Cover }
            ]}
          />
        </Form.Item>
      </Fragment>)}

      <Form.Item label="Vertical align">
        <Select
          defaultValue={layer.valign}
          options={[
            { value: '', label: '---' },
            { value: VerticalAlign.Top },
            { value: VerticalAlign.Middle },
            { value: VerticalAlign.Bottom },
          ]}
          onChange={(e) => handleChange('valign', e.toString())}
        />
      </Form.Item>

      <Form.Item label="Text align">
        <Select 
          defaultValue={layer.textAlign}
          options={[
            { value: TextAlign.Left },
            { value: TextAlign.Center },
            { value: TextAlign.Right },
          ]}
          onChange={(e) => handleChange('textAlign', e.toString())}
        />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
      <Button onClick={handleRemove}>Remove</Button>
    </Form>
  );
}