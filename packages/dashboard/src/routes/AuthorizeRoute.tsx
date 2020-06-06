import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

export const AuthorizeRoute: FunctionComponent<RouteComponentProps> = (props) => {
  console.log({ props });

  return (
    <div>Auth</div>
  );
}
