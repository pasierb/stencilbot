import React, { FunctionComponent, Fragment } from 'react';
import { Layer, ImageFit, VerticalAlign, TextAlign } from '@stencilbot/renderer';
import { Form, Input, Button, Row, Col, Radio } from 'antd';
import { debounce } from 'lodash';
import { GoogleFontSelect } from './GoogleFontSelect';
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined, VerticalAlignMiddleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
  onRemove: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit, onRemove }) => {
  const [form] = Form.useForm();

  const handleSubmit = debounce((values: Store) => {
    const newLayer = new Layer({ ...layer, ...values })

    onSubmit(newLayer);
  }, 300);

  function handleRemove() {
    onRemove(layer);
  }

  return (
    <Form
      onFinish={handleSubmit}
      onChange={(e) => form.submit()}
      form={form}
      size="small"
      wrapperCol={{ span: 16 }}
      labelCol={{ span: 8 }}
      initialValues={layer}
    >
      <Row>
        <Col span={12}>
          <Form.Item label="x" name="x">
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="y" name="y">
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="w" name="w">
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="h" name="h">
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Text" name="txt">
        <Input.TextArea />
      </Form.Item>

      {layer.txt && (<Fragment>
        <Form.Item label="Font family" name="font">
          <GoogleFontSelect
            onChange={v => {
              form.setFieldsValue({ font: v.value });
              form.submit();
            }}
            defaultValue={layer.fontFamily}
          />
        </Form.Item>
        <Form.Item label="Font size" name="fontSize">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Line height" name="lineH">
          <Input type="number" step={0.1} />
        </Form.Item>
        <Form.Item label="Color" name="color">
          <Input type="color" />
        </Form.Item>
      </Fragment>)}
      <Form.Item label="Image" name="img">
        <Input />
      </Form.Item>

      {layer.img && (<Fragment>
        <Form.Item label="Image fit" name="imgFit">
          <Radio.Group>
            <Radio.Button value={undefined}>none</Radio.Button>
            <Radio.Button value={ImageFit.Contain}>contain</Radio.Button>
            <Radio.Button value={ImageFit.Cover}>cover</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Fragment>)}

      <Form.Item label="Vertical align" name="valign">
        <Radio.Group>
          <Radio.Button value={undefined}>
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

      <Form.Item label="Text align" name="txtAlign">
        <Radio.Group>
          <Radio.Button value={undefined}>
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