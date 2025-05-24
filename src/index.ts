import { default as easyBem } from 'easy-bem';
import { BemBlocks, IfNullThenUndefined } from './types';

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
 * }>({
 *   blockNames: ['block'],
 * });
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
function typedBem<B extends BemBlocks>() {
	const bemBlocks = new Map<string, ReturnType<typeof easyBem>>();
	return <BlockName extends keyof B, ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
		blockName: BlockName,
		blockModifiersOrElementName?: IfNullThenUndefined<B[BlockName]['modifiers'], Partial<Record<string, boolean>>> | ElementName,
		elementModifiers?: IfNullThenUndefined<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers'], Partial<Record<string, boolean>>>,
	) => {
		/**
		 * Executes a block of code and handles errors efficiently.
		 * Use `try-catch` when the likelihood of an exception is low,
		 * as it avoids the constant overhead of condition checks compared to `if-else`.
		 *
		 * @example
		 * // Example with try-catch
		 * try {
		 *   performOperation();
		 * } catch (error) {
		 *   console.error("An error occurred:", error);
		 * }
		 *
		 * @remarks
		 * - Use `if-else` for simple conditions that are frequently checked.
		 * - `try-catch` is ideal when exceptions are rare and performance
		 *   gains come from skipping condition evaluations.
		 */
		try {
			return bemBlocks.get(blockName as string)!(blockModifiersOrElementName as string, elementModifiers);
		} catch (e) {
			return bemBlocks.set(blockName as string, easyBem(blockName as string)).get(blockName as string)!(
				blockModifiersOrElementName as string,
				elementModifiers,
			);
		}
	};
}

export default typedBem;
export { typedBem };
