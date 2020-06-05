import React from 'react';
import { RecoilRoot } from 'recoil';
import { Router } from '@reach/router';
import { AuthProvider } from './components/AuthProvider';

import { HomeRoute } from './routes/HomeRoute';
import { EditorRoute } from './routes/EditorRoute';
import { AuthorizeRoute } from './routes/AuthorizeRoute';

const domain = "dev-0c12sn7n.eu.auth0.com";
const clientId = "ntazinXFhbdX0Url0GIrhQfNV34bLXZg";

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <AuthProvider
          domain={domain}
          clientId={clientId}
          redirectUri="http://localhost:3000/auth/callback"
        >
          <Router>
            <HomeRoute path="/" />
            <EditorRoute path="/projects/:projectId/edit" />
            <AuthorizeRoute path="/auth/callback" />
          </Router>
        </AuthProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
