import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
 
export default {
  input: 'lib/deliver.js',
  external: ['canvas'],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs(),
    json()
  ]
};
