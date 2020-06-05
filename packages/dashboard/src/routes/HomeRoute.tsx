import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useAuth } from '../components/AuthProvider';

export const HomeRoute: FunctionComponent<RouteComponentProps> = () => {
  const auth = useAuth();

  return (
    <div>
      <button onClick={auth.loginWithPopup}>Login</button>
    </div>
  );
}
