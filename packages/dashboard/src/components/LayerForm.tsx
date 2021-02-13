import React, { FunctionComponent, Fragment, useState } from 'react';
import { Layer, ImageFit, VerticalAlign, TextAlign, RepeatPattern } from '@stencilbot/renderer';
import { Form, Input, Button, Row, Col, Radio, Checkbox, Slider, Select } from 'antd';
import { debounce } from 'lodash';
import { GoogleFontSelect } from './GoogleFontSelect';
import {
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  LineHeightOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  HighlightOutlined,
  PictureOutlined,
  FontColorsOutlined,
  BoldOutlined,
  EyeOutlined,
  BlockOutlined
} from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';

import style from './LayerForm.module.css';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
  onRemove: (layer: Layer) => void
  onPromote: (layer: Layer) => void
  onDemote: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit, onRemove, onDemote, onPromote }) => {
  const [form] = Form.useForm();
  const [hasBg, setHasBg] = useState<boolean>(!!layer.bg);

  const handleSubmit = debounce((values: Store) => {
    const newLayer = new Layer({ ...layer, ...values })

    if (!hasBg) {
      newLayer.bg = undefined;
    }

    if (!newLayer.txt) {
      newLayer.txt = undefined;
    }

    onSubmit(newLayer);
  }, 150);

  function handleRemove() {
    onRemove(layer);
  }

  return (
    <Form
      onFinish={handleSubmit}
      onChange={(e) => form.submit()}
      form={form}
      size="small"
      wrapperCol={{ span: 20 }}
      labelCol={{ span: 4 }}
      initialValues={layer}
    >
      <Row>
        <Col span={12}>
          <Form.Item label="x" name="x" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
            <Input type="number" suffix="px" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="y" name="y" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
            <Input type="number" suffix="px" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label={<ColumnWidthOutlined title="Width" />} name="w" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
            <Input type="number" suffix="px" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={<ColumnHeightOutlined title="Height" />} name="h" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false}>
            <Input type="number" suffix="px" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Text" name="txt">
        <Input.TextArea />
      </Form.Item>

      <Row>
        <Col span={12}>
          <Form.Item name="valign">
            <Radio.Group>
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
        </Col>
        <Col span={12}>
          <Form.Item name="txtAlign">
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
        </Col>
      </Row>

      <Form.Item label={<BgColorsOutlined title="Background color" />} name="bg" colon={false}>
        <Input
          type="color"
          allowClear={true}
          disabled={!hasBg}
          addonBefore={
            <Checkbox
              defaultChecked={hasBg}
              onChange={e => {
                setHasBg(e.target.checked);
                form.submit();
              }}
            />
          }
        />
      </Form.Item>

      {layer.txt && (<Fragment>
        <Form.Item label={<BoldOutlined title="Font family" />} name="font" colon={false}>
          <GoogleFontSelect
            onChange={v => {
              form.setFieldsValue({ font: v.value });
              form.submit();
            }}
            defaultValue={layer.fontObject?.family}
          />
        </Form.Item>
        <Form.Item label={<FontSizeOutlined title="Font size" />} name="fontSize" colon={false}>
          <Input type="number" suffix="px" />
        </Form.Item>
        <Form.Item label={<LineHeightOutlined title="Line height" />} name="lineH" colon={false} >
          <Input type="number" step={0.1} />
        </Form.Item>
        <Form.Item label={<FontColorsOutlined title="Text color" />} name="color" colon={false}>
          <Input type="color" />
        </Form.Item>
      </Fragment>)}
      <Form.Item label={<PictureOutlined title="Image URL" />} name="img" colon={false}>
        <Input />
      </Form.Item>

      {layer.img && (<Fragment>
        <Form.Item label="Fit" name="imgFit">
          <Radio.Group>
            <Radio.Button value={undefined}>none</Radio.Button>
            <Radio.Button value={ImageFit.Contain}>contain</Radio.Button>
            <Radio.Button value={ImageFit.Cover}>cover</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Fragment>)}

      <Form.Item name="rp" label={<BlockOutlined title="Repeat" />}>
        <Select onChange={() => form.submit()}>
          <Select.Option value="">none</Select.Option>
          <Select.Option value={RepeatPattern.XY}>repeat</Select.Option>
          <Select.Option value={RepeatPattern.X}>repeat-x</Select.Option>
          <Select.Option value={RepeatPattern.Y}>repeat-y</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="alpha" label={<EyeOutlined title="Transparency" />} colon={false}>
        <Slider min={0} max={1} step={.01} onChange={() => form.submit()} defaultValue={1} />
      </Form.Item>

      <div className={style.controls}>
        <Button
          onClick={() => onPromote(layer)}
          icon={<ArrowUpOutlined />}
          size="middle"
          title="Promote layer"
        />
        <Button
          onClick={() => onDemote(layer)}
          icon={<ArrowDownOutlined />}
          size="middle"
          title="Demote layer"
        />
        <Button
          onClick={handleRemove}
          danger
          icon={<DeleteOutlined />}
          size="middle"
          title="Remove layer"
        />
      </div>
    </Form>
  );
}