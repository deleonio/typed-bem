# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** is a TypeScript library for generating BEM-compliant (Block-Element-Modifier) class names with strict type safety. The library ensures that no external type exports are needed, as the API fully infers types based on user input. This makes the library simple to use while maintaining flexibility and strict validation.

## Key Features

- **Type Inference**: Automatically infers types based on the provided BEM structure.
- **No External Dependencies**: Pure TypeScript implementation with no external dependencies.
- **Flexible API**: Supports complex BEM structures with nested elements and modifiers.
- **Self-Contained API**: All types are inferred automatically within the library; there’s no need to import or use external types.
- **Enhanced Modifier Handling**: If modifiers are declared as `null`, they are optional (`undefined`) when calling the BEM generator.
- **Type-Safe**: Guarantees consistent and predictable class names at compile time.
- **Integration with `easy-bem`**: Leverages the robust functionality of `easy-bem`.

## Installation

### Using npm

```bash
npm install typed-bem
```

### Using pnpm

```bash
pnpm add typed-bem
```

## Usage

### Defining Blocks and Elements

The library uses TypeScript generics to define your BEM structure. No external types need to be imported or defined explicitly.

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
			text: {
				modifiers: null; // No modifiers allowed for `text`
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

// Element with `null` modifiers
console.log(bem('button', 'text'));
// Output: "button__text"

// Invalid: Passing modifiers to `text` (will throw a TypeScript error)
// bem('button', 'text', { bold: true });
```

### Modifier Handling with `null`

The library ensures that if `modifiers` are defined as `null`, they become optional (`undefined`) in the API. This simplifies the function signature while maintaining clarity.

```typescript
const bem = typedBem<{
	card: {
		modifiers: 'featured' | 'highlighted';
		elements: {
			header: {
				modifiers: 'compact' | 'spaced';
			};
			footer: {
				modifiers: null; // No modifiers allowed
			};
		};
	};
}>();

// Block
console.log(bem('card', { featured: true }));
// Output: "card card--featured"

// Element with modifiers
console.log(bem('card', 'header', { compact: true }));
// Output: "card__header card__header--compact"

// Element with `null` modifiers
console.log(bem('card', 'footer'));
// Output: "card__footer"

// Invalid: Passing modifiers to footer (will throw a TypeScript error)
// bem('card', 'footer', { expanded: true });
```

### How It Works Internally

#### Type Inference with `IfNullThenUndefined`

The library uses the `IfNullThenUndefined` utility type internally to adjust function parameters dynamically:

```typescript
type IfNullThenUndefined<C, T> = C extends null ? undefined : T;

// Example Usage
type ModifiersForButton = IfNullThenUndefined<'primary' | 'secondary', Record<string, boolean>>;
// Result: Record<string, boolean>

type ModifiersForText = IfNullThenUndefined<null, Record<string, boolean>>;
// Result: undefined
```

This ensures that `null` modifiers are treated as `undefined` when calling the function.

### Full Example

```typescript
const bem = typedBem<{
	nav: {
		modifiers: 'sticky' | 'fixed';
		elements: {
			item: {
				modifiers: 'active' | 'disabled';
			};
			logo: {
				modifiers: null;
			};
		};
	};
}>();

// Block with modifiers
console.log(bem('nav', { sticky: true }));
// Output: "nav nav--sticky"

// Element with modifiers
console.log(bem('nav', 'item', { active: true }));
// Output: "nav__item nav__item--active"

// Element with `null` modifiers
console.log(bem('nav', 'logo'));
// Output: "nav__logo"

// Invalid: Passing modifiers to logo (will throw a TypeScript error)
// bem('nav', 'logo', { large: true });
```

## API Documentation

### `typedBem` Function

The `typedBem` function creates a generator for BEM class names with full type safety.

#### Parameters

1. **`blockName`** (`string`): The name of the block.
2. **`blockModifiersOrElementName`**:
   - If the block has modifiers, provide an object representing them.
   - If calling an element, provide the name of the element.
3. **`elementModifiers`** (optional):
   - Provide an object representing the element modifiers, if applicable.

#### Return Value

A function that generates BEM class names for blocks, elements, and modifiers.

## Why Use `typed-bem`?

- **Self-Contained API**: No types are exported, making the library simple and intuitive.
- **Type Safety**: Prevents runtime errors by enforcing strict TypeScript validation.
- **Flexible and Powerful**: Handles complex BEM structures seamlessly.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

Have questions? Found an issue? Open an issue on GitHub or contact us at [github@martinoppitz.com](mailto:github@martinoppitz.com).

This README reflects the internal use of types, ensuring clarity for users while maintaining a self-contained, easy-to-use API.
