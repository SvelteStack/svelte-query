import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import dts from 'rollup-plugin-dts';
import svelte from 'rollup-plugin-svelte';
import svelteDts from 'svelte-dts';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';

const isDev = process.env.NODE_ENV === 'development';

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: 'src/index.ts',
    external: ['svelte/store', 'react-query/core', 'react-query/hydration'],
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
    plugins: [
      svelte({
        extensions: ['.svelte'],
        preprocess: sveltePreprocess(),
        emitCss: false
      }),
      typescript(),
      terser(), 
      filesize()
    ]
  },
  {
    input: 'src/index.ts',
    external: ['svelte/store', 'react-query/core', 'react-query/hydration'],
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      svelte({
        extensions: ['.svelte'],
        preprocess: sveltePreprocess(),
        emitCss: false
      }),
      svelteDts({
        output: "dist/index.d.ts",
        // preprocess: sveltePreprocess(),
      }),
      dts()
    ]
  }
];