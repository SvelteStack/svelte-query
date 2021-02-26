import svelte from 'rollup-plugin-svelte';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: 'src/index.ts',
	output: [
		{ file: pkg.module, 'format': 'es' },
		{ file: pkg.main, 'format': 'umd', name },
		{ file: pkg.main.replace('.js', '.min.js'), format: 'iife', name, plugins: [terser()] }
	],
	plugins: [
		svelte({
			preprocess: autoPreprocess()
		}),
		typescript(),
		resolve(),
		commonjs()
	]
};
