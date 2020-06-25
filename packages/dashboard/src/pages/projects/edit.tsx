import React, { FunctionComponent, Fragment, useEffect, useState } from 'react';
import { Project } from '@stencilbot/renderer';
import { Editor } from '../../components/Editor';

function getSearchParams(url: URL): {[key: string]: string} {
  const result: {[key: string]: string} = {};

  url.searchParams.forEach((v, k) => {
    result[k] = v;
  })

  return result;
}

const EditorRoute: FunctionComponent = () => {
  const [project, setProject] = useState<Project>()

  useEffect(() => {
    const url = new URL(window.location.toString());
    const params = { w: '800', h: '400', ...getSearchParams(url) };

    setProject(Project.fromSearchParams(params));
  }, []);

  return (<Fragment>
    {project && <Editor project={project} />}
  </Fragment>);
}

export default EditorRoute;
