import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import filesize from 'rollup-plugin-filesize';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    external: ['svelte', 'react-query'],
    output: [
      {
        file: 'dist/index.es.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      }
    ],
    plugins: [typescript(), terser(), filesize()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];