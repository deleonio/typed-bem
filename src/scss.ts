import * as fs from 'fs';

type NonEmptyString<T extends string> = T extends '' ? null : T;

type BemModifiers = {
	modifiers: Set<string | NonEmptyString<''>> | null;
};

type BemElements = {
	[elementName: string]: BemModifiers;
};

type BemBlocks = {
	[blockName: string]: BemModifiers & {
		elements?: BemElements;
	};
};

// Example usage
type AlertBem = {
	alert: {
		elements: {
			container: {
				modifiers: null;
			};
			'container-content': {
				modifiers: null;
			};
			'container-heading': {
				modifiers: null;
			};
			'close-button': {
				modifiers: Set<'close'>;
			};
			content: {
				modifiers: null;
			};
			heading: {
				modifiers: null;
			};
		};
		modifiers: Set<'msg' | 'card' | 'hasCloser' | 'default' | 'error' | 'info' | 'warning' | 'success' | 'variant'>;
	};
};

const alertBem: AlertBem = {
	alert: {
		modifiers: new Set(['msg', 'card', 'hasCloser', 'default', 'error', 'info', 'warning', 'success', 'variant']),
		elements: {
			container: { modifiers: null },
			'container-content': { modifiers: null },
			'container-heading': { modifiers: null },
			'close-button': { modifiers: new Set(['close']) },
			content: { modifiers: null },
			heading: { modifiers: null },
		},
	},
};

const generateBemScss = <B extends BemBlocks>(bemDefinition: B, outputPath: string) => {
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
	fs.writeFileSync(outputPath, scssLines.join('\n'), 'utf8');
};

// Generate SCSS
generateBemScss(alertBem, './alert.scss');
