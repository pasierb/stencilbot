import React, { Fragment } from 'react';
import { Collapse, Layout } from 'antd';
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
    <Layout>
      <ProjectProvider {...data} >
        <ProjectConsumer>
          {({ layers, layerSubjects }) => (
            <Fragment>
              <Layout.Content>
                <Project layers={Array.from(layerSubjects.values())} width={data.width} height={data.height} />
              </Layout.Content>
              <Layout.Sider>
                <Collapse accordion>
                  {layers.map((layer, i) => (
                    <Collapse.Panel key={i} header="">
                      <LayerForm
                        key={i}
                        layer={layer}
                        onSubmit={(l) => {
                          layerSubjects.get(l)!.next(l)
                        }}
                      />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Layout.Sider>
            </Fragment>
          )}
        </ProjectConsumer>
      </ProjectProvider>
    </Layout>
  );
}

export default App;
