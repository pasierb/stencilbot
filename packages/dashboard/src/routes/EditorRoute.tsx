import React, { FunctionComponent, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { RouteComponentProps } from '@reach/router';
import { Layer } from '@stencilbot/renderer';
import { Editor } from '../components/Editor';
import { editorLayers } from '../atoms';

function getSearchParams(url: URL): {[key: string]: string} {
  return [...url.searchParams.entries()].reduce((acc, [k, v]) => {
    acc[k] = v;

    return acc;
  }, {});
}

export const EditorRoute: FunctionComponent<RouteComponentProps> = () => {
  const setLayers = useSetRecoilState(editorLayers);

  useEffect(() => {
    const url = new URL(window.location.toString());
    const layers = Layer.fromSearchParams(getSearchParams(url));

    setLayers(layers);
  });

  return (<Editor />);
}
