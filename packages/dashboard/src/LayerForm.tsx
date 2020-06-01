import React, { FunctionComponent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Layer, LayerInit, ImageFit } from '@stencilbot/renderer';
import { Form, Input, Button, Select } from 'antd';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit }) => {
  const { handleSubmit, control } = useForm<LayerInit>({ defaultValues: layer.attributes });

  const submit = handleSubmit(data => {
    layer.attributes = data;

    onSubmit(layer)
  });

  return (
    <Form onChange={submit}>
      <Form.Item label="X">
        <Controller as={Input} name="x" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Y">
        <Controller as={Input} name="y" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Color">
        <Controller as={Input} name="color" type="color" control={control} />
      </Form.Item>
      <Form.Item label="Text">
        <Controller as={Input.TextArea} name="text" control={control} />
      </Form.Item>
      <Form.Item label="imageFit">
        <Controller name="imageFit" control={control} as={<Select options={[{ value: ImageFit.None }, { value: ImageFit.Contain }]} />} />
      </Form.Item>

      <Button htmlType="submit">Submit</Button>
    </Form>
  );
}