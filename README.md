# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** is a TypeScript library for generating BEM-compliant (Block-Element-Modifier) class names with strict type safety. It enforces correct usage of blocks, elements, and modifiers using TypeScript generics, ensuring clean and maintainable CSS class names.

Typed BEM supports both individual blocks and entire component libraries, allowing you to centralize and reuse your design system efficiently.

> Vision: Additionally, Typed BEM can generate a SCSS file structure directly from your BEM type definitions, helping you synchronize your TypeScript code with your CSS and HTML.

## Key Features

- **Type-Safe**: Guarantees valid class name generation at compile time.
- **Set-Based Modifiers**: Efficiently handles modifiers using `Set<string>`.
- **Validation**: Modifiers cannot be empty strings (`""`).
- **Component Library Support**: Use individual blocks or combine them into a unified BEM generator for your entire design system.
- **SCSS Generation**: Automatically create a SCSS file structure from your type definitions, bridging the gap between TypeScript and CSS.
- **Flexible API**: Supports complex BEM structures with nested elements and dynamic modifiers.
- **No External Dependencies**: Lightweight and built with pure TypeScript.

## Installation

Install the package using npm or pnpm:

### Using npm

```bash
npm install typed-bem
```

### Using pnpm

```bash
pnpm add typed-bem
```

## Usage

Define your BEM structure using TypeScript generics. Modifiers are defined as `Set<string>` for flexibility. Empty modifiers (`""`) are not allowed and will cause TypeScript errors.

### Example 1: Button Component

```typescript
import typedBem from 'typed-bem';

// Define your BEM structure
const buttonBem = typedBem<{
	button: {
		modifiers: Set<'primary' | 'secondary'>;
		elements: {
			icon: {
				modifiers: Set<'small' | 'large'>;
			};
			text: {
				modifiers: never; // No modifiers allowed for `text`
			};
		};
	};
}>();

// Block with modifiers
console.log(buttonBem('button', { primary: true }));
// Output: "button button--primary"

// Element with modifiers
console.log(buttonBem('button', 'icon', { small: true }));
// Output: "button__icon button__icon--small"

// Element with no modifiers
console.log(buttonBem('button', 'text'));
// Output: "button__text"
```

### Example 2: Component Library

You can combine multiple BEM blocks into a single generator to streamline your component library's design system.

```typescript
const bem = typedBem<{
	button: {
		modifiers: Set<'primary' | 'secondary'>;
		elements: {
			icon: {
				modifiers: Set<'small' | 'large'>;
			};
		};
	};
	alert: {
		modifiers: Set<'success' | 'error' | 'warning'>;
		elements: {
			container: {
				modifiers: Set<'padded'>;
			};
		};
	};
}>();

// Button block
console.log(bem('button', { primary: true }));
// Output: "button button--primary"

// Alert block
console.log(bem('alert', { success: true }));
// Output: "alert alert--success"

// Shared elements and modifiers
console.log(bem('button', 'icon', { large: true }));
// Output: "button__icon button__icon--large"
console.log(bem('alert', 'container', { padded: true }));
// Output: "alert__container alert__container--padded"
```

### Generating SCSS from Type Definitions

Typed BEM can generate a SCSS structure from your BEM type definitions, ensuring that your CSS matches your TypeScript structure.

#### Example SCSS Generator

Here’s a simple script to convert your type definitions into a SCSS file structure:

```typescript
import fs from 'fs';
import { default as typedBem } from 'typed-bem';

const bemDefinition = {
	button: {
		modifiers: new Set(['primary', 'secondary']),
		elements: {
			icon: { modifiers: new Set(['small', 'large']) },
			text: { modifiers: null },
		},
	},
	alert: {
		modifiers: new Set(['success', 'error', 'warning']),
		elements: {
			container: { modifiers: new Set(['padded']) },
		},
	},
} as const;

const generateScss = (bemDef: typeof bemDefinition, outputPath: string) => {
	const scssLines: string[] = [];

	Object.entries(bemDef).forEach(([block, blockDef]) => {
		scssLines.push(`.${block} {`);
		if (blockDef.modifiers) {
			blockDef.modifiers.forEach((modifier) => {
				scssLines.push(`  &--${modifier} {}`);
			});
		}
		if (blockDef.elements) {
			Object.entries(blockDef.elements).forEach(([element, elementDef]) => {
				scssLines.push(`  &__${element} {`);
				if (elementDef.modifiers) {
					elementDef.modifiers.forEach((modifier) => {
						scssLines.push(`    &--${modifier} {}`);
					});
				}
				scssLines.push(`  }`);
			});
		}
		scssLines.push(`}`);
	});

	fs.writeFileSync(outputPath, scssLines.join('\n'), 'utf8');
};

// Generate SCSS
generateScss(bemDefinition, './bem-structure.scss');
```

#### Example Output (`bem-structure.scss`)

```scss
.button {
	&--primary {
	}
	&--secondary {
	}
	&__icon {
		&--small {
		}
		&--large {
		}
	}
	&__text {
	}
}

.alert {
	&--success {
	}
	&--error {
	}
	&--warning {
	}
	&__container {
		&--padded {
		}
	}
}
```

## API Documentation

### `typedBem` Function

The `typedBem` function creates a generator for BEM class names with strict type safety.

#### Parameters

1. **`blockName`** (`string`): The name of the block.
2. **`blockModifiersOrElementName`**:
   - An object representing block modifiers.
   - Or the name of an element.
3. **`elementModifiers`** (optional):
   - An object representing the element modifiers, if applicable.

#### Return Value

A function that generates BEM class names for blocks, elements, and their modifiers.

## Why Use `typed-bem`?

- **Strict Validation**: Prevents invalid or empty modifiers like `""`.
- **Component Library Support**: Manage multiple blocks and elements in a unified structure.
- **SCSS Generation**: Synchronize TypeScript definitions with SCSS to ensure consistency.
- **Set-Based Modifier Handling**: Efficiently processes modifiers with `Set<string>`.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

Have questions? Found an issue? Open an issue on GitHub or contact us at [github@martinoppitz.com](mailto:github@martinoppitz.com).
