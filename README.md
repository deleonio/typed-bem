# Typed BEM

[![npm](https://img.shields.io/npm/v/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![license](https://img.shields.io/npm/l/typed-bem)](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/typed-bem)](https://www.npmjs.com/package/typed-bem)
[![issues](https://img.shields.io/github/issues/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/issues)
[![pull requests](https://img.shields.io/github/issues-pr/deleonio/typed-bem-class-generator)](https://github.com/deleonio/typed-bem-class-generator/pulls)
[![size](https://img.shields.io/bundlephobia/min/typed-bem)](https://bundlephobia.com/result?p=typed-bem)
![contributors](https://img.shields.io/github/contributors/deleonio/typed-bem-class-generator)

## Overview

**Typed BEM** extends the battle-tested [easy-bem](https://www.npmjs.com/package/easy-bem) utility with first-class TypeScript
support. You describe the valid blocks, elements, and modifiers once, and Typed BEM turns that definition into:

- type-safe class name factories,
- helper utilities for composing class lists, and
- an optional SCSS file generator that mirrors your schema.

By centralizing your BEM schema in TypeScript you remove guesswork, prevent typos, and keep styles synchronized across your
project.

## Reference Project

This library is used in the [KoliBri](https://github.com/public-ui/kolibri) project - an accessible web component library that provides a comprehensive set of UI components following accessibility best practices. KoliBri demonstrates real-world usage of Typed BEM for maintaining consistent and type-safe BEM class names across a large component library.

## Key Features

- **Type-Safe API** – Catch invalid blocks, elements, or modifiers during development instead of at runtime.
- **Set-Based Modifiers** – Model allowed modifiers with `Set<string>` for fast lookups and precise literal unions.
- **SCSS Generator** – Produce starter SCSS files that follow the same structure as your TypeScript schema.
- **Tree-Shakeable Helpers** – `generateBemClassNames`, `uniqueClassNames`, and `generateBemScssFile` are exported individually.
- **Lightweight Footprint** – Built directly on top of `easy-bem` with no extra runtime dependencies.

## Installation

Install the package with your preferred package manager:

```bash
npm install typed-bem
# or
pnpm add typed-bem
yarn add typed-bem
```

## Quick Start

### 1. Describe your schema

Define a TypeScript type that captures the blocks, their elements, and the allowed modifiers. Use `Set` when modifiers are
allowed and `null` when they are not.

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

### 2. Generate class names

`generateBemClassNames` reads your schema and returns a strongly typed helper. Invalid combinations immediately trigger
TypeScript errors.

```typescript
const bem = generateBemClassNames<ButtonBem>();

bem('button');
// "button"

bem('button', { primary: true });
// "button button--primary"

bem('button', 'icon', { small: true });
// "button__icon button__icon--small"

// bem('button', { tertiary: true });      // TypeScript error: unknown modifier
// bem('button', 'label');                  // TypeScript error: unknown element
```

### 3. Merge class names

Use `uniqueClassNames` to combine dynamic class name fragments while removing duplicates and falsy values.

```typescript
import { uniqueClassNames } from 'typed-bem';

const className = uniqueClassNames(
  'button',
  bem('button', 'icon', { small: props.isSmall }),
  props.className,
);
// -> every class appears only once
```

### 4. Generate a SCSS skeleton (optional)

Typed BEM can mirror your schema into an SCSS file. When creating `Set` values for modifiers, cast array literals with `as const`
so the literal types stay intact.

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

The generator writes a file named `button.scss` next to your script:

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

- **Returns** a cached `bem` function.
- **Parameters**
  - `blockName` – a key from your schema.
  - `blockModifiersOrElementName` – either a partial record of block modifiers or an element name.
  - `elementModifiers` – (optional) a partial record of element modifiers when targeting an element.

### `uniqueClassNames`

```typescript
declare function uniqueClassNames(...chunks: (string | undefined | null | false)[]): string;
```

- Flattens the provided arguments into a single class string.
- Ignores falsy values and empty strings.
- Removes duplicate class names in the final result.

### `generateBemScssFile`

```typescript
declare function generateBemScssFile<B extends BemBlocks<BemSchema>>(definition: B, outputPath: string): void;
```

- Writes `<outputPath>.scss` in the current working directory.
- Accepts the same schema object you use to generate class names.
- Intended for Node.js environments; import it from `typed-bem/scss`.

## License

Typed BEM is distributed under the [MIT License](https://github.com/deleonio/typed-bem-class-generator/blob/main/LICENSE).
