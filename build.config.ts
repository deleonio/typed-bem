import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true,
	declaration: true,
	entries: ['./src/browser.ts', './src/node.ts'],
	failOnWarn: true,
	rollup: {
		emitCJS: true,
		esbuild: {
			minify: true,
		},
		inlineDependencies: true,
	},
	sourcemap: true,
});
