import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
 
export default {
  input: [
    'lib/delivery/anonymous.js',
    'lib/delivery/project.js'
  ],
  external: [
    'canvas',
    'aws-sdk'
  ],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json()
  ]
};
