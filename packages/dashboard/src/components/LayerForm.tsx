import React, { FunctionComponent, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Layer, LayerInit, ImageFit, VerticalAlign, TextAlign } from '@stencilbot/renderer';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { debounce } from 'lodash';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
  onRemove: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit, onRemove }) => {
  const { handleSubmit, control } = useForm<LayerInit>({ defaultValues: layer });

  const submit = debounce(handleSubmit(data => {
    const newLayer = new Layer({ ...data, id: layer.id, order: layer.order });

    onSubmit(newLayer);
  }), 100);

  function handleRemove() {
    onRemove(layer);
  }

  return (
    <Form onChange={() => submit()} size="small" layout="horizontal">
      <Row>
        <Col span={12}>
          <Form.Item label="x">
            <Controller as={Input} name="x" type="number" control={control} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="y">
            <Controller as={Input} name="y" type="number" control={control} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="w">
            <Controller as={Input} name="width" type="number" control={control} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="h">
            <Controller as={Input} name="height" type="number" control={control} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Text">
        <Controller as={Input.TextArea} name="text" control={control} />
      </Form.Item>

      {layer.text && (<Fragment>
        <Form.Item label="Font family">
          <Controller as={Input} name="fontFamily" control={control} />
        </Form.Item>
        <Form.Item label="Font size">
          <Controller as={Input} name="fontSize" type="number" control={control} />
        </Form.Item>
        <Form.Item label="Font weight">
          <Controller as={Input} name="fontWeight" control={control} />
        </Form.Item>
        <Form.Item label="Line height">
          <Controller as={Input} name="lineHeight" type="number" control={control} />
        </Form.Item>
        <Form.Item label="Color">
          <Controller as={Input} name="color" type="color" control={control} />
        </Form.Item>
      </Fragment>)}
      <Form.Item label="Image">
        <Controller as={Input} name="imageUri" control={control} />
      </Form.Item>

      {layer.imageUri && (<Fragment>
        <Form.Item label="Image fit">
          <Controller
            name="imageFit"
            control={control}
            as={
              <Select options={[
                { value: ImageFit.None },
                { value: ImageFit.Contain },
                { value: ImageFit.Cover }
              ]} />
            }
          />
        </Form.Item>
      </Fragment>)}

      <Form.Item label="Vertical align">
        <Controller
          name="valign"
          control={control}
          as={
            <Select options={[
              { value: VerticalAlign.Top },
              { value: VerticalAlign.Middle },
              { value: VerticalAlign.Bottom },
            ]} />
          }
        />
      </Form.Item>

      <Form.Item label="Text align">
        <Controller
          name="textAlign"
          control={control}
          as={
            <Select options={[
              { value: TextAlign.Left },
              { value: TextAlign.Center },
              { value: TextAlign.Right },
            ]} />
          }
        />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
      <Button onClick={handleRemove}>Remove</Button>
    </Form>
  );
}