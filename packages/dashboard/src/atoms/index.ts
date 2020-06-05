import { atom } from 'recoil';
import { Layer } from '@stencilbot/renderer';

export const editorLayers = atom<Layer[]>({
  key: 'editorLayers',
  default: []
});
