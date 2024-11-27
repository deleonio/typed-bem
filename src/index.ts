import { default as easyBem } from 'easy-bem';

/**
 * Creates a typed BEM (Block Element Modifier) class generator function.
 *
 * @template ModifiersByElement - A record type where keys are element names and values are arrays of modifier names.
 *
 * @param {string} blockName - The name of the BEM block. Must be a non-empty string.
 * @param {ModifiersByElement} elementModifiers - An object where keys are element names and values are arrays of valid modifier names for those elements.
 *
 * @returns {(elementName: string, modifiers: Partial<Record<ModifiersByElement[string][number], boolean>>) => string}
 * A function that generates a BEM class string for a given element and its modifiers.
 *
 * @throws {Error} If the block name is not a non-empty string.
 * @throws {Error} If any element name is not a non-empty string.
 * @throws {Error} If any modifier name is not a non-empty string.
 * @throws {Error} If an element name is not defined in the block.
 * @throws {Error} If a modifier name is not defined for the specified element.
 *
 * @example
 * ```typescript
 * const bemGenerator = createTypedBem('button', {
 *   icon: ['small', 'large'],
 *   text: ['bold', 'italic']
 * });
 *
 * const className = bemGenerator('icon', { small: true, large: false });
 * // className will be 'button__icon button__icon--small'
 * ```
 */
const bem = <ModifiersByBlock extends readonly string[], ModifiersByElement extends Record<string, readonly string[]>>(
	blockName: string,
	blockModifiers: ModifiersByBlock = [] as never as ModifiersByBlock,
	elementModifiers: ModifiersByElement = {} as ModifiersByElement,
) => {
	if (typeof blockName !== 'string' || blockName.length === 0) {
		throw new Error('Block name must be a string and not empty!');
	}
	const blockBem = easyBem(blockName);
	blockModifiers.forEach((elementName) => {
		if (elementName.length === 0) {
			throw new Error(`Modifier names from the block "${blockName}" must be a string and not empty!`);
		}
	});
	const elementNames = Object.keys(elementModifiers);
	elementNames.forEach((elementName) => {
		if (elementName.length === 0) {
			throw new Error(`Element names from the block "${blockName}" must be a string and not empty!`);
		} else if (elementModifiers[elementName].some((modifier) => typeof modifier !== 'string' || modifier === '')) {
			throw new Error(`Modifier names of element "${elementName}" from the block "${blockName}" must be a string and not empty!`);
		}
	});

	return <ElementName extends keyof ModifiersByElement>(
		elementNameOrBlockModifiers?: ElementName | Partial<Record<ModifiersByBlock[number], boolean>>,
		modifiers: Partial<Record<ModifiersByElement[ElementName][number], boolean>> = {},
	): string => blockBem(elementNameOrBlockModifiers as string, modifiers);
};

export default bem;
