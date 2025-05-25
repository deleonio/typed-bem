import { writeFileSync } from 'fs';
import { BemBlocks, BemSchema } from './types';

function generateBemScssFile<B extends BemBlocks<BemSchema>>(bemDefinition: B, outputPath: string) {
	const scssLines: string[] = [];

	Object.entries(bemDefinition).forEach(([blockName, blockDefinition]) => {
		// Add the block
		scssLines.push(`.${blockName} {`);

		// Process block modifiers
		if (blockDefinition.modifiers && blockDefinition.modifiers instanceof Set) {
			blockDefinition.modifiers.forEach((modifier) => {
				scssLines.push(`  &--${modifier} {`);
				scssLines.push(`    // Styles for ${blockName}--${modifier}`);
				scssLines.push(`  }`);
			});
		}

		// Process elements
		if (blockDefinition.elements) {
			Object.entries(blockDefinition.elements).forEach(([elementName, elementDefinition]) => {
				scssLines.push(`  &__${elementName} {`);

				// Process element modifiers
				if (elementDefinition.modifiers && elementDefinition.modifiers instanceof Set) {
					elementDefinition.modifiers.forEach((modifier) => {
						scssLines.push(`    &--${modifier} {`);
						scssLines.push(`      // Styles for ${blockName}__${elementName}--${modifier}`);
						scssLines.push(`    }`);
					});
				} else {
					scssLines.push(`    // Styles for ${blockName}__${elementName}`);
				}

				scssLines.push(`  }`);
			});
		}

		scssLines.push(`}`);
	});

	// Write the SCSS structure to the output file
	writeFileSync(`${outputPath}.scss`, scssLines.join('\n'), 'utf8');
}

export { generateBemScssFile };
