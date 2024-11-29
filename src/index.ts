import { default as easyBem } from 'easy-bem';

type NonEmptyString<T extends string> = T extends '' ? null : T;

type IfNullThenUndefined<C, T> = C extends null ? undefined : T;

type BemModifiers = {
	modifiers: Set<string | NonEmptyString<''>> | never;
};

type BemElements = {
	[elementName: string]: BemModifiers;
};

type BemBlocks = {
	[blockName: string]: BemModifiers & {
		elements?: BemElements;
	};
};

/**
 * A utility function to generate BEM (Block Element Modifier) class names with TypeScript type safety.
 *
 * @template B - A type representing the structure of the BEM blocks, elements, and modifiers.
 *
 * @returns A function that generates BEM class names.
 *
 * @example
 * ```typescript
 * const bem = typedBem<{
 *   block: {
 *     modifiers: 'modifier1' | 'modifier2';
 *     elements: {
 *       element1: {
 *         modifiers: 'modifierA' | 'modifierB';
 *       };
 *       element2: {
 *         modifiers: never;
 *       };
 *     };
 *   };
 * }>();
 *
 * // Generate block class name
 * bem('block', { modifier1: true }); // "block block--modifier1"
 *
 * // Generate element1 class name
 * bem('block', 'element1', { modifierA: true }); // "block__element block__element--modifierA"
 *
 * // Invalid: Passing modifiers to element2 (will throw a TypeScript error)
 * bem('block', 'element2', { modifierA: true }); // "block__element block__element--modifierA"
 */
const typedBem = <B extends BemBlocks>() => {
	const blocks = new Map<string, ReturnType<typeof easyBem>>();
	return <BlockName extends keyof B, ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
		blockName: BlockName,
		blockModifiersOrElementName?: IfNullThenUndefined<B[BlockName]['modifiers'], Partial<Record<string, boolean>>> | ElementName,
		elementModifiers?: IfNullThenUndefined<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers'], Partial<Record<string, boolean>>>,
	) => {
		if (!blocks.has(blockName as string)) {
			blocks.set(blockName as string, easyBem(blockName as string));
		}
		return blocks.get(blockName as string)!(blockModifiersOrElementName as string, elementModifiers);
	};
};

export default typedBem;
