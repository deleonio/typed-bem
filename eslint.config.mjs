import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				global: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'off', // TypeScript handles this
		},
	},
	{
		files: ['src/sample/**/*.ts', 'test/**/*.ts'],
		rules: {
			'no-console': 'off', // Allow console in samples and tests
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				console: 'readonly',
				process: 'readonly',
				Buffer: 'readonly',
				global: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-console': 'warn',
		},
	},
];
