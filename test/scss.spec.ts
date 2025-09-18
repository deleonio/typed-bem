import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { generateBemScssFile } from '../src/node/scss';
import type { BemBlocks, BemSchema } from '../src/types';

describe('generateBemScssFile - SCSS generation with layers', () => {
	const testBem: BemBlocks<BemSchema> = {
		alert: {
			modifiers: new Set(['success', 'error', 'warning']),
			elements: {
				icon: {
					modifiers: new Set(['large', 'small']),
				},
				content: {
					modifiers: null,
				},
			},
		},
		button: {
			modifiers: new Set(['primary', 'secondary']),
			elements: {
				label: {
					modifiers: null,
				},
			},
		},
	};

	const testOutputPath = './test-output';
	const testOutputFile = `${testOutputPath}.scss`;

	afterEach(() => {
		// Clean up generated files after each test
		if (existsSync(testOutputFile)) {
			unlinkSync(testOutputFile);
		}
	});

	describe('without layer option', () => {
		it('should generate SCSS without @layer wrapper', () => {
			generateBemScssFile(testBem, testOutputPath);

			expect(existsSync(testOutputFile)).to.be.true;
			const content = readFileSync(testOutputFile, 'utf8');

			// Should not contain @layer
			expect(content).to.not.include('@layer');

			// Should contain basic BEM structures
			expect(content).to.include('.alert {');
			expect(content).to.include('&--success {');
			expect(content).to.include('&__icon {');
			expect(content).to.include('&--large {');
			expect(content).to.include('.button {');
			expect(content).to.include('&--primary {');
			expect(content).to.include('&__label {');
		});

		it('should generate correct indentation without layer', () => {
			generateBemScssFile(testBem, testOutputPath);

			const content = readFileSync(testOutputFile, 'utf8');
			const lines = content.split('\n');

			// Check that top-level blocks start at column 0
			expect(lines.find((line) => line === '.alert {')).to.exist;
			expect(lines.find((line) => line === '.button {')).to.exist;

			// Check that modifiers are indented with 2 spaces
			expect(lines.find((line) => line === '  &--success {')).to.exist;
			expect(lines.find((line) => line === '  &--primary {')).to.exist;

			// Check that elements are indented with 2 spaces
			expect(lines.find((line) => line === '  &__icon {')).to.exist;
			expect(lines.find((line) => line === '  &__label {')).to.exist;

			// Check that element modifiers are indented with 4 spaces
			expect(lines.find((line) => line === '    &--large {')).to.exist;
		});
	});

	describe('with layer option', () => {
		it('should generate SCSS with @layer wrapper', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: 'components' });

			expect(existsSync(testOutputFile)).to.be.true;
			const content = readFileSync(testOutputFile, 'utf8');

			// Should contain @layer
			expect(content).to.include('@layer components {');
			expect(content).to.include('}');

			// Should contain basic BEM structures inside layer
			expect(content).to.include('.alert {');
			expect(content).to.include('&--success {');
			expect(content).to.include('&__icon {');
			expect(content).to.include('.button {');
		});

		it('should generate correct indentation with layer', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: 'components' });

			const content = readFileSync(testOutputFile, 'utf8');
			const lines = content.split('\n');

			// Check layer wrapper
			expect(lines[0]).to.equal('@layer components {');
			expect(lines[lines.length - 1]).to.equal('}');

			// Check that blocks are indented with 2 spaces inside layer
			expect(lines.find((line) => line === '  .alert {')).to.exist;
			expect(lines.find((line) => line === '  .button {')).to.exist;

			// Check that modifiers are indented with 4 spaces
			expect(lines.find((line) => line === '    &--success {')).to.exist;
			expect(lines.find((line) => line === '    &--primary {')).to.exist;

			// Check that elements are indented with 4 spaces
			expect(lines.find((line) => line === '    &__icon {')).to.exist;
			expect(lines.find((line) => line === '    &__label {')).to.exist;

			// Check that element modifiers are indented with 6 spaces
			expect(lines.find((line) => line === '      &--large {')).to.exist;
		});

		it('should support nested layer names', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: 'theme.components' });

			const content = readFileSync(testOutputFile, 'utf8');

			expect(content).to.include('@layer theme.components {');
			expect(content).to.include('  .alert {');
			expect(content).to.include('  .button {');
		});

		it('should support single-word layer names', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: 'utilities' });

			const content = readFileSync(testOutputFile, 'utf8');

			expect(content).to.include('@layer utilities {');
		});

		it('should properly close layer wrapper', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: 'components' });

			const content = readFileSync(testOutputFile, 'utf8');
			const lines = content.split('\n');

			// First line should be layer opening
			expect(lines[0]).to.equal('@layer components {');

			// Last line should be layer closing
			expect(lines[lines.length - 1]).to.equal('}');

			// Count opening and closing braces should match
			const openBraces = (content.match(/{/g) || []).length;
			const closeBraces = (content.match(/}/g) || []).length;
			expect(openBraces).to.equal(closeBraces);
		});
	});

	describe('layer option edge cases', () => {
		it('should handle empty layer name gracefully with console warning', () => {
			// Mock console.warn to capture the warning
			const originalWarn = console.warn;
			let warningMessage = '';
			console.warn = (message: string) => {
				warningMessage = message;
			};

			generateBemScssFile(testBem, testOutputPath, { layer: '' });

			// Restore original console.warn
			console.warn = originalWarn;

			const content = readFileSync(testOutputFile, 'utf8');

			// Should not add @layer with empty name
			expect(content).to.not.include('@layer');
			expect(content).to.include('.alert {');

			// Should have logged a warning
			expect(warningMessage).to.equal('Warning: Empty layer name provided. No CSS layer will be generated.');
		});

		it('should handle layer with spaces', () => {
			generateBemScssFile(testBem, testOutputPath, { layer: ' components ' });

			const content = readFileSync(testOutputFile, 'utf8');

			// Should add @layer with spaces (truthy string)
			expect(content).to.include('@layer  components  {');
		});

		it('should handle undefined options gracefully', () => {
			generateBemScssFile(testBem, testOutputPath, undefined);

			const content = readFileSync(testOutputFile, 'utf8');

			// Should behave like no layer option
			expect(content).to.not.include('@layer');
			expect(content).to.include('.alert {');
		});

		it('should handle empty options object gracefully', () => {
			generateBemScssFile(testBem, testOutputPath, {});

			const content = readFileSync(testOutputFile, 'utf8');

			// Should behave like no layer option
			expect(content).to.not.include('@layer');
			expect(content).to.include('.alert {');
		});
	});

	describe('content comparison between layer and non-layer output', () => {
		it('should generate identical BEM structures regardless of layer', () => {
			// Generate without layer
			generateBemScssFile(testBem, testOutputPath);
			const contentWithoutLayer = readFileSync(testOutputFile, 'utf8');
			unlinkSync(testOutputFile);

			// Generate with layer
			generateBemScssFile(testBem, testOutputPath, { layer: 'components' });
			const contentWithLayer = readFileSync(testOutputFile, 'utf8');

			// Remove layer wrapper and normalize indentation for comparison
			const layerContent = contentWithLayer.replace('@layer components {', '').replace(/^}/m, '').replace(/^ {2}/gm, ''); // Remove 2-space indentation

			// Both should have same BEM structure
			expect(layerContent.trim()).to.equal(contentWithoutLayer.trim());
		});
	});

	describe('complex BEM structures with layers', () => {
		it('should handle blocks without modifiers but with elements', () => {
			const simpleBem: BemBlocks<BemSchema> = {
				card: {
					modifiers: null,
					elements: {
						header: { modifiers: null },
						body: { modifiers: new Set(['padded']) },
					},
				},
			};

			generateBemScssFile(simpleBem, testOutputPath, { layer: 'components' });
			const content = readFileSync(testOutputFile, 'utf8');

			expect(content).to.include('@layer components {');
			expect(content).to.include('  .card {');
			expect(content).to.include('    &__header {');
			expect(content).to.include('    &__body {');
			expect(content).to.include('      &--padded {');
		});

		it('should handle blocks with modifiers but without elements', () => {
			const simpleBem: BemBlocks<BemSchema> = {
				badge: {
					modifiers: new Set(['small', 'large']),
					elements: undefined,
				},
			};

			generateBemScssFile(simpleBem, testOutputPath, { layer: 'utilities' });
			const content = readFileSync(testOutputFile, 'utf8');

			expect(content).to.include('@layer utilities {');
			expect(content).to.include('  .badge {');
			expect(content).to.include('    &--small {');
			expect(content).to.include('    &--large {');
			expect(content).to.not.include('&__');
		});
	});
});
