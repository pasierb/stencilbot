import React, { FunctionComponent, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Layer, LayerInit, ImageFit, VerticalAlign, TextAlign } from '@stencilbot/renderer';
import { Form, Input, Button, Select } from 'antd';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit }) => {
  const { handleSubmit, control } = useForm<LayerInit>({ defaultValues: layer });

  const submit = handleSubmit(data => {
    const newLayer = new Layer({ ...data, id: layer.id, order: layer.order });

    onSubmit(newLayer);
  });

  return (
    <Form onChange={submit} size="small">
      <Form.Item label="X">
        <Controller as={Input} name="x" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Y">
        <Controller as={Input} name="y" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Width">
        <Controller as={Input} name="width" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Height">
        <Controller as={Input} name="height" type="number" control={control} />
      </Form.Item>
      <Form.Item label="Text">
        <Controller as={Input.TextArea} name="text" control={control} />
      </Form.Item>

      {layer.text && (<Fragment>
        <Form.Item label="Font size">
          <Controller as={Input} name="fontSize" type="number" control={control} />
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
    </Form>
  );
}