import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	clean: true,
	declaration: true,
	entries: ['./src/index.ts'],
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
