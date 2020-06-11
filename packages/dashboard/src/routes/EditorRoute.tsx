import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Project } from '@stencilbot/renderer';
import { Editor } from '../components/Editor';

function getSearchParams(url: URL): {[key: string]: string} {
  return [...url.searchParams.entries()].reduce((acc, [k, v]) => {
    acc[k] = v;

    return acc;
  }, {});
}

export const EditorRoute: FunctionComponent<RouteComponentProps> = () => {
  const url = new URL(window.location.toString());
  const project = Project.fromSearchParams(getSearchParams(url));

  return (<Editor project={project} />);
}
