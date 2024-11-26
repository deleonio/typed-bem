# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![build](https://img.shields.io/github/actions/workflow/status/deleonio/typed-bem-class-generator/ci.yml)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

---

## Overview

Typed BEM is a TypeScript library designed to generate BEM-compliant class names in a type-safe and efficient manner. Built on top of the robust [`easy-bem`](https://www.npmjs.com/package/easy-bem) package, it extends its functionality by adding full TypeScript type safety and enhanced validation.

---

## Features

- **Type-Safe**: Ensures consistent and predictable class names at compile-time.
- **Built on `easy-bem`**: Leverages the reliable functionality of `easy-bem`.
- **Flexible API**: Easily define blocks, elements, and modifiers with complete control.
- **Error Handling**: Provides meaningful errors for invalid elements or modifiers.

---

## How TypeScript Enhances DX

One of the standout benefits of Typed BEM is its seamless integration with TypeScript, which ensures:

- **Error Prevention at Usage**: Thanks to TypeScript's type system, invalid elements or modifiers are caught during coding. Code editors like Visual Studio Code highlight these issues instantly, allowing developers to correct mistakes before they even run the code.
- **Real-Time Feedback**: Autocomplete suggestions and inline warnings guide you through the correct usage of the library.
- **Improved Developer Efficiency**: By reducing debugging time and avoiding runtime errors, Typed BEM significantly enhances the developer experience (DX).

This makes Typed BEM not only a robust tool for managing CSS class names but also a joy to work with during development.

---

## Installation

### Using npm

```bash
npm install typed-bem
```

### Using pnpm

```bash
pnpm add typed-bem
```

---

## Usage

Here’s an example of how to use `typed-bem`:

```typescript
import bem from 'typed-bem';

// Create a BEM block generator
const buttonBem = bem('button', ['primary', 'secondary'], {
	icon: ['small', 'large'],
	text: ['bold', 'italic'],
});

// Generate block classes
console.log(buttonBem());
// Output: "button"

// Block with modifiers
console.log(buttonBem({ primary: true }));
// Output: "button button--primary"

// Element
console.log(buttonBem('icon'));
// Output: "button__icon"

// Element with modifiers
console.log(buttonBem('icon', { small: true }));
// Output: "button__icon button__icon--small"
```

---

## API Documentation

### `bem`

The `bem` function creates a typed generator for BEM class names.

#### Signature

```typescript
bem<ModifiersByBlock extends readonly string[], ModifiersByElement extends Record<string, readonly string[]>>(
  blockName: string,
  blockModifiers?: ModifiersByBlock,
  elementModifiers?: ModifiersByElement
): (
  elementNameOrBlockModifiers?: keyof ModifiersByElement | Partial<Record<ModifiersByBlock[number], boolean>>,
  modifiers?: Partial<Record<ModifiersByElement[keyof ModifiersByElement][number], boolean>>
) => string;
```

#### Parameters

1. **`blockName`**: `string`
   The name of the block (e.g., `"button"`). This is required.

2. **`blockModifiers`**: `ModifiersByBlock` (optional)
   An array of valid block modifiers (e.g., `["primary", "secondary"]`).

3. **`elementModifiers`**: `ModifiersByElement` (optional)
   A record mapping element names to arrays of their valid modifiers (e.g., `{ icon: ["small", "large"] }`).

#### Returns

A function that generates BEM class names for the block, its elements, and modifiers.

---

## Examples

### 1. Basic Usage

```typescript
const bemGenerator = bem('card', ['featured'], {
	header: ['compact', 'spaced'],
	footer: ['highlighted'],
});

// Block
console.log(bemGenerator());
// Output: "card"

// Block with modifiers
console.log(bemGenerator({ featured: true }));
// Output: "card card--featured"

// Element
console.log(bemGenerator('header'));
// Output: "card__header"

// Element with modifiers
console.log(bemGenerator('header', { compact: true }));
// Output: "card__header card__header--compact"
```

---

### 2. Handling Errors

```typescript
const bemGenerator = bem('button', ['primary'], {
	icon: ['small', 'large'],
});

// Invalid element
try {
	bemGenerator('invalidElement');
} catch (error) {
	console.error(error.message);
	// Output: Element "invalidElement" is not defined in block "button"!
}

// Invalid modifier
try {
	bemGenerator('icon', { invalidModifier: true });
} catch (error) {
	console.error(error.message);
	// Output: Modifier "invalidModifier" is not defined in element "icon" of block "button"!
}
```

---

### 3. Block Modifiers Only

```typescript
const bemGenerator = bem('button', ['primary', 'secondary']);

console.log(bemGenerator({ primary: true }));
// Output: "button button--primary"

console.log(bemGenerator({ primary: true, secondary: false }));
// Output: "button button--primary"
```

---

## Error Handling

The library validates your inputs and throws descriptive errors when:

1. A block name is empty or not a string.
2. An element name is not defined in the block.
3. A modifier is not defined for a given block or element.

## Limitations and Notes

1. **Compile-Time vs Runtime Validations**:

   - TypeScript ensures type safety during compilation, but some checks (e.g., invalid element names or modifiers) are performed at runtime. Always validate your input.

2. **Performance Considerations**:

   - For large configurations with many elements and modifiers, runtime validation could introduce slight overhead. For most cases, this is negligible.

3. **Defined Inputs**:

   - Ensure that all block modifiers and element modifiers are predefined. The library will throw errors for any undefined values.

4. **BEM Convention**:
   - The library strictly adheres to the BEM convention (`block__element--modifier`). Ensure your CSS follows the same pattern to avoid inconsistencies.

---

## Why `typed-bem`?

`typed-bem` builds on the solid foundation of `easy-bem`, adding enhanced TypeScript support and runtime validation. It ensures that your BEM class names remain consistent and type-safe throughout your codebase.

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Contact

For any questions or suggestions, please open an issue on GitHub or contact us at <github@martinoppitz.com>.
