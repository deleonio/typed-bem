# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** is an extension of the lightweight and proven [easy-bem](https://www.npmjs.com/package/easy-bem) library. While `easy-bem` efficiently generates BEM (Block-Element-Modifier) class names, `Typed BEM` enhances it with TypeScript typings to create a type-safe and scalable approach for managing your CSS.

This library not only ensures correctness at compile time but also allows you to use your TypeScript definitions to drive your SCSS architecture, making it a robust solution for creating and maintaining large-scale BEM-based design systems.

## Key Features

- **Built on Easy-BEM**: Combines the simplicity of `easy-bem` with the power of TypeScript.
- **Type Safety**: Guarantees correct usage of blocks, elements, and modifiers at compile time.
- **SCSS-Driven Approach**: Use TypeScript definitions to programmatically generate SCSS files, ensuring consistent styles.
- **Flexible and Scalable**: Supports nested elements, complex modifiers, and unified design systems.
- **Set-Based Modifiers**: Efficiently handles and validates modifiers using `Set<string>`.
- **Lightweight**: Minimal overhead with no additional dependencies beyond `easy-bem`.

## Installation

Install using npm or pnpm:

### Using npm

```bash
npm install typed-bem
```

### Using pnpm

```bash
pnpm add typed-bem
```

## Usage

Typed BEM introduces a type-safe way to define and generate BEM class names. Define your BEM structures using TypeScript generics, ensuring correctness and preventing invalid combinations.

### Example: Single Component

```typescript
import generateBemClassNames from 'typed-bem';

const bem = generateBemClassNames<{
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
console.log(bem('button', { primary: true }));
// Output: "button button--primary"

// Element with modifiers
console.log(bem('button', 'icon', { small: true }));
// Output: "button__icon button__icon--small"

// Element without modifiers
console.log(bem('button', 'text'));
// Output: "button__text"
```

## API Documentation

### `generateBemClassNames`

#### Function Signature

```typescript
generateBemClassNames<B extends BemBlocks>(): TypedBemFunction<B>;
```

#### Returns

The function returns a **BEM generator function** that accepts:

- **`blockName`** (`keyof B`): The name of the block.
- **`blockModifiersOrElementName`**:
  - A record of block modifiers.
  - Or the name of an element (`keyof B[BlockName]['elements']`).
- **`elementModifiers`** _(optional)_: A record of element modifiers, if applicable.

## SCSS Integration

Typed BEM allows you to synchronize your TypeScript definitions with your SCSS structure by generating SCSS files programmatically.

### SCSS Generator Script

```typescript
const bemDefinition = {
	button: {
		modifiers: new Set(['primary', 'secondary']),
		elements: {
			icon: { modifiers: new Set(['small', 'large']) },
			text: { modifiers: null },
		},
	},
	alert: {
		modifiers: new Set(['success', 'error']),
		elements: {
			container: { modifiers: new Set(['padded']) },
		},
	},
} as const;

// Generate SCSS file
generateBemScssFile(bemDefinition, './bem-structure');
```

### Example Output (`bem-structure.scss`)

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
	&__container {
		&--padded {
		}
	}
}
```

## Why Use `typed-bem`?

- **Built on Easy-BEM**: Combines the simplicity of `easy-bem` with strict TypeScript typing.
- **SCSS Synchronization**: Generate SCSS files from your TypeScript definitions for consistency.
- **Type Safety**: Catch invalid combinations of blocks, elements, and modifiers at compile time.
- **Scalable Design Systems**: Perfect for large projects with multiple components.

## License

Typed BEM is licensed under the [MIT License](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE).
