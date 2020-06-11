import React, { FunctionComponent, useEffect } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { RouteComponentProps } from '@reach/router';
import { Layer } from '@stencilbot/renderer';
import { Editor } from '../components/Editor';
import { editorLayers, editorProject } from '../atoms';

function getSearchParams(url: URL): {[key: string]: string} {
  return [...url.searchParams.entries()].reduce((acc, [k, v]) => {
    acc[k] = v;

    return acc;
  }, {});
}

export const EditorRoute: FunctionComponent<RouteComponentProps> = () => {
  const setProject = useSetRecoilState(editorProject);
  const setLayers = useSetRecoilState(editorLayers);

  useEffect(() => {
    const url = new URL(window.location.toString());
    const layers = Layer.fromSearchParams(getSearchParams(url));
    const width = url.searchParams.get('w') ? +url.searchParams.get('w')! : 800;
    const height = url.searchParams.get('w') ? +url.searchParams.get('h')! : 400;

    setProject({ width, height });
    setLayers(layers);
  });

  return (<Editor />);
}
