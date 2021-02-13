import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
 
export default {
  input: 'lib/lambda/index.js',
  external: [
    'canvas',
    'aws-sdk'
  ],
  output: {
    file: "dist/lambda/index.js",
    format: "cjs"
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json()
  ]
};
