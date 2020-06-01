import React, { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { Layer, LayerInit, ImageFit } from '@stencilbot/renderer';

interface LayerFormProps {
  layer: Layer
  onSubmit: (layer: Layer) => void
}

export const LayerForm: FunctionComponent<LayerFormProps> = ({ layer, onSubmit }) => {
  const { register, handleSubmit } = useForm<LayerInit>({ defaultValues: layer.attributes });

  const submit = handleSubmit(data => {
    layer.attributes = data;

    onSubmit(layer)
  });

  return (
    <form onSubmit={submit}>
      <div className="columns">
        <div className="column is-marginless field">
          <label className="label is-small">X</label>
          <div className="control">
            <input name="x" className="input is-small" type="number" ref={register} />
          </div>
        </div>

        <div className="column is-marginless field">
          <label className="label is-small">Y</label>
          <div className="control">
            <input name="y" className="input is-small" type="number" ref={register} />
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label is-small">text</label>
        <div className="control">
          <textarea className="textarea is-small" name="text" ref={register} />
        </div>
      </div>

      <div className="field">
        <label className="label is-small">color</label>
        <div className="control">
          <input name="color" className="input is-small" type="color" ref={register} />
        </div>
      </div>

      <div className="field">
        <label className="label is-small">image fit</label>
        <div className="control">
          <div className="select is-small">
            <select name="imageFit" ref={register}>
              <option value={ImageFit.None}>none</option>
              <option value={ImageFit.Contain}>contain</option>
              <option value={ImageFit.Cover}>cover</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}