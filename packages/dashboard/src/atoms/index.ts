import { atom } from 'recoil';
import { Layer } from '@stencilbot/renderer';

interface Project {
  width: number
  height: number
}

export const editorLayers = atom<Layer[]>({
  key: 'editorLayers',
  default: []
});

export const editorProject = atom<Project>({
  key: 'editorProject',
  default: {
    width: 600,
    height: 300
  }
})