import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true,
	declaration: true,
	entries: ['./src/class.ts', './src/scss.ts'],
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
