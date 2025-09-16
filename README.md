# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** extends the proven [easy-bem](https://www.npmjs.com/package/easy-bem) library with first-class TypeScript
support. It lets you describe blocks, elements and modifiers in a typed schema and generates a fully typed helper for
creating BEM class names. On top of that, the package ships with a small utility to de-duplicate class name strings and a
Node helper that can scaffold matching SCSS structures from the same schema.

## Key Features

- **Type-safe helpers** – create BEM class names with compile-time validation for blocks, elements and modifiers.
- **Set-based schemas** – describe allowed modifiers with `Set` literals to drive both runtime usage and typings.
- **Utility helpers** – use `uniqueClassNames` to merge class name strings without duplicates.
- **SCSS generator** – generate placeholder SCSS files from the same schema to keep styles and TypeScript in sync.
- **Lightweight** – no runtime dependencies besides `easy-bem`.

## Installation

Install via your preferred package manager:

```bash
npm install typed-bem
# or
pnpm add typed-bem
```

## Getting Started

### 1. Describe your BEM schema

Create a TypeScript type (or interface) that mirrors the blocks, elements and modifiers you want to allow. Use
`Set<...>` for modifiers that should exist and `null` when a block or element does not support modifiers.

```typescript
import { generateBemClassNames } from 'typed-bem';

type ButtonBem = {
        button: {
                modifiers: Set<'primary' | 'secondary'> | null;
                elements: {
                        icon: {
                                modifiers: Set<'small' | 'large'> | null;
                        };
                        text: {
                                modifiers: null;
                        };
                };
        };
};
```

### 2. Generate class names with full typing

```typescript
const bem = generateBemClassNames<ButtonBem>();

bem('button');
// => "button"

bem('button', { primary: true });
// => "button button--primary"

bem('button', 'icon', { small: true });
// => "button__icon button__icon--small"

// bem('button', { tertiary: true }); // TypeScript error: "tertiary" is not a known modifier
// bem('button', 'label'); // TypeScript error: "label" is not a defined element
```

### 3. Combine class names safely

The package also exposes a tiny helper that merges class name strings while stripping duplicates and falsy values.

```typescript
import { uniqueClassNames } from 'typed-bem';

const className = uniqueClassNames(
        'button',
        bem('button', 'icon', { small: props.isSmall }),
        props.className,
);
// Produces a single string with every class only once
```

## Generating SCSS skeletons

For Node environments, you can scaffold SCSS placeholders that match your schema. This keeps your styles and TypeScript
definitions aligned.

```typescript
import { generateBemScssFile } from 'typed-bem/scss';

const buttonBemDefinition: ButtonBem = {
        button: {
                modifiers: new Set(['primary', 'secondary'] as const),
                elements: {
                        icon: { modifiers: new Set(['small', 'large'] as const) },
                        text: { modifiers: null },
                },
        },
};

generateBemScssFile(buttonBemDefinition, './button');
```

The snippet above writes a `button.scss` file with placeholders for every block, element and modifier combination:

```scss
.button {
  &--primary {
    // Styles for button--primary
  }
  &--secondary {
    // Styles for button--secondary
  }
  &__icon {
    &--small {
      // Styles for button__icon--small
    }
    &--large {
      // Styles for button__icon--large
    }
  }
  &__text {
    // Styles for button__text
  }
}
```

## API Reference

### `generateBemClassNames`

```typescript
declare function generateBemClassNames<B extends BemBlocks<BemSchema>>(): TypedBemFunction<B>;
```

Returns a memoized function for producing BEM class names. The returned helper accepts:

1. `blockName` – the block to render (`keyof B`).
2. `blockModifiersOrElementName` – either a modifier record for the block or the name of an element on the block.
3. `elementModifiers` *(optional)* – a modifier record for the element when an element name was provided.

All modifier records are strongly typed based on the string literal unions extracted from your schema.

### `uniqueClassNames`

```typescript
declare function uniqueClassNames(...chunks: (string | undefined | null | false)[]): string;
```

Merges the provided chunks into a single class name string, ignoring falsy values and removing duplicates.

### `generateBemScssFile`

```typescript
declare function generateBemScssFile<B extends BemBlocks<BemSchema>>(definition: B, outputPath: string): void;
```

Writes a `<outputPath>.scss` file that mirrors the provided schema. The helper is available through the
`typed-bem/scss` entry point and should be executed in a Node environment.

## License

Typed BEM is released under the [MIT License](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE).
