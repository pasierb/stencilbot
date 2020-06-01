import React from 'react';
import { LayerForm } from './LayerForm';
import { ProjectProvider, ProjectConsumer } from './ProjectProvider';
import { Project } from './Project';

function App() {
  const data = {
    width: 400,
    height: 400,
    layers: [
      {
        imageUri: 'https://i.imgur.com/XRUz8BV.png'
      },
      {
        text: "woot\nha!",
        y: 40
      },
      {
        text: "From 0x0",
        fontSize: 20,
        color: '#ff0000'
      }
    ]
  };

  return (
    <div className="container is-fluid">
      <ProjectProvider {...data} >
        <ProjectConsumer>
          {({ layers, layerSubjects }) => (
            <div className="columns">
              <div className="column is-four-fifths">
                <Project layers={Array.from(layerSubjects.values())} width={data.width} height={data.height} />
              </div>
              <div className="column">
                {layers.map((layer, i) => (
                  <LayerForm
                    key={i}
                    layer={layer}
                    onSubmit={(l) => {
                      layerSubjects.get(l)!.next(l)
                    }}
                  />)
                )}
              </div>
            </div>
          )}
        </ProjectConsumer>
      </ProjectProvider>
    </div>
  );
}

export default App;
