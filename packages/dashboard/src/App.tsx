import React from 'react';
import { Router } from '@reach/router';

import { HomeRoute } from './routes/HomeRoute';
import { EditorRoute } from './routes/EditorRoute';

function App() {
  return (
    <Router>
      <HomeRoute path="/" />
      <EditorRoute path="/projects/edit" />
    </Router>
  );
}

export default App;
