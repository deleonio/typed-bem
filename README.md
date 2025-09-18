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

### 1. Describe your schemas

Define a TypeScript type that captures the blocks, their elements, and the allowed modifiers. Use `Set` when modifiers are
allowed and `null` when they are not. **Best Practice:** Define all your components in a central schema for better maintainability.

```typescript
import { generateBemClassNames } from 'typed-bem';

// Central schemas for all components (recommended approach)
type ComponentsSchema = {
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
	input: {
		modifiers: Set<'error' | 'success'> | null;
		elements: {
			label: {
				modifiers: Set<'required' | 'disabled'> | null;
			};
			field: {
				modifiers: null;
			};
		};
	};
};
```

### 2. Generate class names

`generateBemClassNames` reads your schemas and returns a strongly typed helper. Invalid combinations immediately trigger
TypeScript errors.

```typescript
// Create a single BEM instance for all components
const bem = generateBemClassNames<ComponentsSchema>();

// Direct usage (always works)
bem('button');
// "button"

bem('button', { primary: true });
// "button button--primary"

bem('button', 'icon', { small: true });
// "button__icon button__icon--small"

// bem('button', { tertiary: true });      // TypeScript error: unknown modifier
// bem('button', 'label');                  // TypeScript error: unknown element
```

### 3. Alternative Short Syntax

For components where you work primarily with one block or element, you can use the `forBlock()` and `forElement()` methods. These are optional shortcuts for convenience.

#### Block-bound generators

```typescript
// Create block-specific generators
const buttonBem = bem.forBlock('button');
const inputBem = bem.forBlock('input');

// Now you can omit the block name!
buttonBem(); // "button"
buttonBem({ primary: true }); // "button button--primary"
buttonBem('icon', { small: true }); // "button__icon button__icon--small"

inputBem({ error: true }); // "input input--error"
inputBem('label', { required: true }); // "input__label input__label--required"
```

#### Element-bound generators

```typescript
// Create element-specific generators
const buttonIconBem = buttonBem.forElement('icon');
const inputLabelBem = inputBem.forElement('label');

// Ultra-short syntax for common elements
buttonIconBem(); // "button__icon"
buttonIconBem({ small: true }); // "button__icon button__icon--small"

inputLabelBem({ required: true }); // "input__label input__label--required"
```

These methods are particularly useful for repetitive tasks but are not required for general usage.

### 4. Merge class names

Use `uniqueClassNames` to combine dynamic class name fragments while removing duplicates and falsy values.

```typescript
import { uniqueClassNames } from 'typed-bem';

const className = uniqueClassNames(bem('button'), bem('button', 'icon', { small: props.isSmall }), props.className);
```

### 5. Generate a SCSS skeleton (optional)

Typed BEM can mirror your schema into an SCSS file. When creating `Set` values for modifiers, cast array literals with `as const`
so the literal types stay intact.

```typescript
import { generateBemScssFile } from 'typed-bem/scss';

const componentDefinition: ComponentsSchema = {
	button: {
		modifiers: new Set(['primary', 'secondary'] as const),
		elements: {
			icon: { modifiers: new Set(['small', 'large'] as const) },
			text: { modifiers: null },
		},
	},
	input: {
		modifiers: new Set(['error', 'success'] as const),
		elements: {
			label: { modifiers: new Set(['required', 'disabled'] as const) },
			field: { modifiers: null },
		},
	},
};

generateBemScssFile(componentDefinition, './components');
```

The generator writes a file named `components.scss` next to your script:

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

.input {
	&--error {
		// Styles for input--error
	}
	&--success {
		// Styles for input--success
	}
	&__label {
		&--required {
			// Styles for input__label--required
		}
		&--disabled {
			// Styles for input__label--disabled
		}
	}
	&__field {
		// Styles for input__field
	}
}
```

## Usage Patterns

### Central Schema Registration (Recommended)

Instead of creating separate `generateBemClassNames` instances for each component, register all components in a central schema:

```typescript
// schema.ts - Central BEM schema
type AppBemSchema = {
	header: {
		/* ... */
	};
	navigation: {
		/* ... */
	};
	button: {
		/* ... */
	};
	input: {
		/* ... */
	};
	modal: {
		/* ... */
	};
	// ... all your components
};

export const bem = generateBemClassNames<AppBemSchema>();
```

```typescript
// components/Button.tsx
import { bem } from '../schema';

const buttonBem = bem.forBlock('button');

export function Button({ variant, size, children }) {
  return (
    <button className={buttonBem({ [variant]: true })}>
      {children}
    </button>
  );
}
```

### Migration from Direct Usage

The new API is fully backward compatible. You can migrate incrementally:

```typescript
// Before (still works)
const oldStyle = bem('button', { primary: true });

// After (more convenient for single-block components)
const buttonBem = bem.forBlock('button');
const newStyle = buttonBem({ primary: true });
```

### Component-Specific Patterns

```typescript
// For components with frequent element usage
const modalBem = bem.forBlock('modal');
const modalHeaderBem = modalBem.forElement('header');
const modalBodyBem = modalBem.forElement('body');
const modalFooterBem = modalBem.forElement('footer');

// Usage in component
<div className={modalBem({ open: isOpen })}>
  <header className={modalHeaderBem()}>Title</header>
  <main className={modalBodyBem()}>Content</main>
  <footer className={modalFooterBem()}>Actions</footer>
</div>
```

## API Reference

### `generateBemClassNames`

```typescript
declare function generateBemClassNames<B extends BemBlocks<BemSchema>>(): TypedBemFunction<B>;
```

- **Returns** a cached `bem` function with additional methods.
- **Parameters**
  - `blockName` – a key from your schema.
  - `blockModifiersOrElementName` – either a partial record of block modifiers or an element name.
  - `elementModifiers` – (optional) a partial record of element modifiers when targeting an element.

#### Extended Methods

- **`.forBlock(blockName)`** – Returns a block-bound generator that doesn't require the block name.
- **`.forElement(elementName)`** – Available on block-bound generators, returns an element-bound generator.

**Example:**

```typescript
const bem = generateBemClassNames<Schema>();

// Direct usage
bem('button', { primary: true });

// Block-bound usage
const buttonBem = bem.forBlock('button');
buttonBem({ primary: true });

// Element-bound usage
const iconBem = buttonBem.forElement('icon');
iconBem({ small: true });
```

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
