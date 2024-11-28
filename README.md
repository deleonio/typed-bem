# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** is a TypeScript library for generating BEM-compliant (Block-Element-Modifier) class names with full type safety. It is built on top of [`easy-bem`](https://www.npmjs.com/package/easy-bem) and extends its functionality with strict type definitions.

## Features

- **Type-Safe**: Ensures consistent and predictable class names at compile time.
- **Flexible and Scalable**: Supports simple and complex BEM structures.
- **Integration with `easy-bem`**: Utilizes the robust functionality of `easy-bem`.
- **Intuitive API**: Enables quick and easy definition and usage of blocks, elements, and modifiers.

## Installation

### With npm

```bash
npm install typed-bem
```

### With pnpm

```bash
pnpm add typed-bem
```

## Type Definitions

### `BemModifiers`

```typescript
export type BemModifiers = {
	modifiers?: string;
};
```

- **Description**: Defines modifiers for a block or element.
- **Example**:
  ```typescript
  type ButtonModifiers = {
  	modifiers: 'primary' | 'secondary';
  };
  ```

### `BemElements`

```typescript
export type BemElements = {
	[elementName: string]: BemModifiers;
};
```

- **Description**: Defines elements within a block and their corresponding modifiers.
- **Example**:
  ```typescript
  type ButtonElements = {
  	icon: {
  		modifiers: 'small' | 'large';
  	};
  	text: {
  		modifiers: 'bold' | 'italic';
  	};
  };
  ```

### `BemBlocks`

```typescript
export type BemBlocks = {
	[blockName: string]: BemModifiers & {
		elements?: BemElements;
	};
};
```

- **Description**: Defines blocks, their modifiers, and their elements.
- **Example**:
  ```typescript
  type Blocks = {
  	button: {
  		modifiers: 'primary' | 'secondary';
  		elements: {
  			icon: {
  				modifiers: 'small' | 'large';
  			};
  			text: {
  				modifiers: 'bold' | 'italic';
  			};
  		};
  	};
  };
  ```

## Usage

### Basic Usage

```typescript
import typedBem from 'typed-bem';

// Define your BEM structure
const bem = typedBem<{
	button: {
		modifiers: 'primary' | 'secondary';
		elements: {
			icon: {
				modifiers: 'small' | 'large';
			};
		};
	};
}>();

// Block
console.log(bem('button'));
// Output: "button"

// Block with modifiers
console.log(bem('button', { primary: true }));
// Output: "button button--primary"

// Element
console.log(bem('button', 'icon'));
// Output: "button__icon"

// Element with modifiers
console.log(bem('button', 'icon', { small: true }));
// Output: "button__icon button__icon--small"
```

## Type Safety

The `typed-bem` library provides full control and safety over your BEM structure using TypeScript.

### Example

```typescript
const bem = typedBem<{
	card: {
		modifiers: 'featured' | 'highlighted';
		elements: {
			header: {
				modifiers: 'compact' | 'spaced';
			};
			footer: {
				modifiers: 'expanded';
			};
		};
	};
}>();

// Block
console.log(bem('card', { featured: true }));
// Output: "card card--featured"

// Element
console.log(bem('card', 'header', { compact: true }));
// Output: "card__header card__header--compact"
```

## API Documentation

### `typedBem` Function

The `typedBem` function creates a generator for BEM class names with full type safety.

#### Parameters

1. **`blockName`** (`string`): The name of the block.
2. **`blockModifiersOrElementName`**: Either an object with block modifiers or the name of an element.
3. **`elementModifiers`**: (optional) An object with element modifiers.

#### Return Value

A function that generates BEM class names for blocks, elements, and modifiers.

## Why Use `typed-bem`?

- Strict adherence to BEM conventions.
- Improved developer experience (DX) with type safety and auto-completion.
- Powerful and flexible for projects of any size.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

Have questions? Found an issue? Open an issue on GitHub or contact us at [github@martinoppitz.com](mailto:github@martinoppitz.com).
