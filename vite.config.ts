/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
	plugins: [
		// devtools(),
		solidPlugin(),
	],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
	test: {
		environment: 'jsdom',
		globals: true,
		transformMode: { web: [/\.[jt]sx?$/] },
	},
});
