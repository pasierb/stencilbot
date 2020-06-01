import React from 'react';
import { createContext, FunctionComponent, useState } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';
import { LayerInit, Layer } from '@cardstamp/renderer';

interface ProjectProviderProps {
  width: number
  height: number
  layers: LayerInit[]
}

interface ProjectContextValue {
  layers: Layer[],
  layerSubjects: Map<Layer, Subject<Layer>>
}

const ProjectContext = createContext<ProjectContextValue>({
  layers: [],
  layerSubjects: new Map()
});

const ProjectConsumer = ProjectContext.Consumer;

const ProjectProvider: FunctionComponent<ProjectProviderProps> = ({ width, height, layers: rawLayers, children }) => {
  const [layers] = useState(rawLayers.map(l => new Layer(l)));
  const [layerSubjects] = useState(layers.reduce((acc, layer) => {
    acc.set(layer, new BehaviorSubject(layer))

    return acc;
  }, new Map<Layer, BehaviorSubject<Layer>>()))

  return (
    <ProjectContext.Provider value={{ layers, layerSubjects  }}>
      {children}
    </ProjectContext.Provider>
  );
}

export { ProjectConsumer, ProjectProvider };
