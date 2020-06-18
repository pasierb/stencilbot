import React, { FunctionComponent } from 'react';
import { Select } from 'antd';

import data from '../presets.json';
import { SelectProps } from 'antd/lib/select';

interface PresetsData {
  default?: boolean
  value?: string
  label: string
  children?: PresetsData[]
}

const defaultItem = data.find(it => it.default);
export const defaultValue = defaultItem && defaultItem.value;

export const PresetSelect: FunctionComponent<SelectProps<string>> = (props) => {
  return <Select placeholder="Select preset" defaultValue={defaultValue} {...props}>
    {(data as PresetsData[]).map((it, i) => {
      return it.children ? (
        <Select.OptGroup label={it.label} key={i}>
          {it.value && (
            <Select.Option value={it.value}>{it.label}</Select.Option>
          )}
          {it.children.map((chld, j) => (
            <Select.Option value={chld.value!} key={(i*100) + j}>
              {chld.label}
            </Select.Option>
          ))}
        </Select.OptGroup>
      ) : (
        <Select.Option value={it.value!} key={i}>
          {it.label}
        </Select.Option>
      );
    })}
  </Select>
}