import React from 'react';
import { RecoilRoot } from 'recoil';
import { Router } from '@reach/router';

import { HomeRoute } from './routes/HomeRoute';
import { EditorRoute } from './routes/EditorRoute';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <Router>
          <HomeRoute path="/" />
          <EditorRoute path="/projects/edit" />
        </Router>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
