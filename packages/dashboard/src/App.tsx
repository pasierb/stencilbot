import React from 'react';
import { Project } from './Project';

function App() {
  const project = {
    width: 400,
    height: 400,
    layers: [
      {
        text: "hell",
        y: 0,
        imageUri: "https://i1.kwejk.pl/k/obrazki/2020/05/IaJcVc2s74kLam2l.jpg"
      },
      {
        text: "woot",
        y: 40
      },
      {
        text: "From 0x0",
        fontSize: 20,
        color: 'red'
      }
    ]
  };

  return (
    <div>
      tu
      <Project project={project} />
    </div>
  );
}

export default App;
