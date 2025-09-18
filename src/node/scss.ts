import { writeFileSync } from 'fs';
import { BemBlocks, BemSchema } from '../types';

export type GenerateBemScssOptions = {
	layer?: string;
};

function generateBemScssFile<B extends BemBlocks<BemSchema>>(bemDefinition: B, outputPath: string, options?: GenerateBemScssOptions) {
	const scssLines: string[] = [];

	// Check for explicitly empty layer and warn
	const shouldUseLayer = options?.layer !== undefined && options.layer !== '';
	const hasEmptyLayer = options?.layer === '';

	if (hasEmptyLayer) {
		console.warn('Warning: Empty layer name provided. No CSS layer will be generated.');
	}

	// Add CSS layer if specified and not empty
	if (shouldUseLayer) {
		scssLines.push(`@layer ${options.layer} {`);
	}

	Object.entries(bemDefinition).forEach(([blockName, blockDefinition]) => {
		// Add the block
		const indent = shouldUseLayer ? '  ' : '';
		scssLines.push(`${indent}.${blockName} {`);

		// Process block modifiers
		if (blockDefinition.modifiers && blockDefinition.modifiers instanceof Set) {
			blockDefinition.modifiers.forEach((modifier) => {
				scssLines.push(`${indent}  &--${modifier} {`);
				scssLines.push(`${indent}    // Styles for ${blockName}--${modifier}`);
				scssLines.push(`${indent}  }`);
			});
		}

		// Process elements
		if (blockDefinition.elements) {
			Object.entries(blockDefinition.elements).forEach(([elementName, elementDefinition]) => {
				scssLines.push(`${indent}  &__${elementName} {`);

				// Process element modifiers
				if (elementDefinition.modifiers && elementDefinition.modifiers instanceof Set) {
					elementDefinition.modifiers.forEach((modifier) => {
						scssLines.push(`${indent}    &--${modifier} {`);
						scssLines.push(`${indent}      // Styles for ${blockName}__${elementName}--${modifier}`);
						scssLines.push(`${indent}    }`);
					});
				} else {
					scssLines.push(`${indent}    // Styles for ${blockName}__${elementName}`);
				}

				scssLines.push(`${indent}  }`);
			});
		}

		scssLines.push(`${indent}}`);
	});

	// Close CSS layer if specified and not empty
	if (shouldUseLayer) {
		scssLines.push('}');
	}

	// Write the SCSS structure to the output file
	writeFileSync(`${outputPath}.scss`, scssLines.join('\n'), 'utf8');
}

export { generateBemScssFile };
