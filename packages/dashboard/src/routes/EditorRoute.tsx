import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

interface EditorRouteProps extends RouteComponentProps {
  projectId?: string
}

export const EditorRoute: FunctionComponent<EditorRouteProps> = ({ projectId }) => {
  return (
    <div>Editor {projectId}</div>
  );
}
