import { default as easyBem } from 'easy-bem';

export type BemModifiers = {
	modifiers?: string;
};

export type BemElements = {
	[elementName: string]: BemModifiers;
};

export type BemBlocks = {
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
 *       element: {
 *         modifiers: 'modifierA' | 'modifierB';
 *       };
 *     };
 *   };
 * }>();
 *
 * // Generate block class name
 * bem('block', { modifier1: true }); // "block block--modifier1"
 *
 * // Generate element class name
 * bem('block', 'element', { modifierA: true }); // "block__element block__element--modifierA"
 * ```
 *
 * @param blockName - The name of the BEM block.
 * @param blockModifiersOrElementName - Either an object representing the block modifiers or the name of the element.
 * @param elementModifiers - An object representing the element modifiers.
 *
 * @returns The generated BEM class name.
 */
const typedBem = <B extends BemBlocks>() => {
	const blocks = new Map<string, ReturnType<typeof easyBem>>();
	return <BlockName extends keyof B, ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
		blockName: BlockName,
		blockModifiersOrElementName?: Partial<Record<NonNullable<B[BlockName]['modifiers']>, boolean>> | ElementName,
		elementModifiers?: Partial<Record<NonNullable<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
	) => {
		if (!blocks.has(blockName as string)) {
			blocks.set(blockName as string, easyBem(blockName as string));
		}
		return blocks.get(blockName as string)!(blockModifiersOrElementName as string, elementModifiers);
	};
};

export default typedBem;
