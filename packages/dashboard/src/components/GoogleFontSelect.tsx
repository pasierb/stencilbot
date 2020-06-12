import React, { useEffect, useState, FunctionComponent } from 'react';
import { Cascader, Spin } from 'antd';
import { CascaderValueType, CascaderOptionType } from 'antd/lib/cascader';

interface GoogleWebFontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: {[key: string]: string}
  category: string
  kind: string
}

interface GoogleWebFontsAPIResponse {
  kind: string
  items: GoogleWebFontFamily[]
}

interface GoogleFontSelectValue {
  fontFamily: string
  variant: string
  value: string
  uri: string
}

interface GoogleFontSelectProps {
  onChange?: (value: GoogleFontSelectValue) => void
  defaultValue?: string
}

let dataPromise: Promise<GoogleWebFontsAPIResponse>;

function fetchData() {
  if (dataPromise) {
    return dataPromise;
  }

  dataPromise = fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.REACT_APP_GOOGLE_FONTS_API_KEY}`)
    .then(r => r.json()) as Promise<GoogleWebFontsAPIResponse>;

  return dataPromise;
}

export const GoogleFontSelect: FunctionComponent<GoogleFontSelectProps> = ({ onChange, defaultValue }) => {
  const [fonts, setFonts] = useState<GoogleWebFontsAPIResponse>();

  useEffect(() => {
    fetchData().then(data => {
      setFonts(data);
    });
  });

  let options: CascaderOptionType[] = [];
  if (fonts) {
    options = fonts.items.map(font => {
      return {
        font,
        value: font.family,
        label: font.family,
        children: font.variants.map(variant => ({
          value: variant,
          label: variant
        }))
      }
    });
  }

  const handleChange = (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => {
    const font = selectedOptions![0]['font'] as GoogleWebFontFamily;
    const fontFamily = selectedOptions![0].value as string;
    const variant = selectedOptions![1].value as string;

    if (onChange) {
      onChange({
        fontFamily,
        variant,
        value: [fontFamily, variant].join(':'),
        uri: font.files[variant]
      })
    }
  }

  return fonts
    ? (<Cascader
      showSearch
      options={options}
      onChange={handleChange}
      defaultValue={defaultValue ? defaultValue.split(':') : undefined}
    />)
    : (<Spin size="small" />)
}
