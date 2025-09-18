import { default as easyBem } from 'easy-bem';
import { BemBlocks, BemSchema } from '../types';

type KeysOfSet<T> = T extends Set<infer U> ? U : never;

function generateBemClassNames<B extends BemBlocks<BemSchema>>() {
	const bemBlocks = new Map<string, ReturnType<typeof easyBem>>();

	const bem = <BlockName extends keyof B, ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
		blockName: BlockName,

		// Block-Modifier oder Element-Name
		blockModifiersOrElementName?:
			| (KeysOfSet<B[BlockName]['modifiers']> extends never ? undefined : Partial<Record<KeysOfSet<B[BlockName]['modifiers']>, boolean>>)
			| ElementName,

		// Element-Modifier, wenn ein Element angegeben wurde
		elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
			? undefined
			: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
	): string => {
		try {
			return bemBlocks.get(blockName as string)!(blockModifiersOrElementName as string, elementModifiers);
		} catch {
			return bemBlocks.set(blockName as string, easyBem(blockName as string)).get(blockName as string)!(
				blockModifiersOrElementName as string,
				elementModifiers,
			);
		}
	};

	// Block-gebundener BEM Generator
	bem.forBlock = <BlockName extends keyof B>(blockName: BlockName) => {
		type BlockBem = {
			<ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
				elementNameOrBlockModifiers?:
					| ElementName
					| (KeysOfSet<B[BlockName]['modifiers']> extends never ? undefined : Partial<Record<KeysOfSet<B[BlockName]['modifiers']>, boolean>>),
				elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
					? undefined
					: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
			): string;
			forElement: <ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
				elementName: ElementName,
			) => (
				elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
					? undefined
					: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
			) => string;
		};

		const blockBem: BlockBem = <ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
			elementNameOrBlockModifiers?:
				| ElementName
				| (KeysOfSet<B[BlockName]['modifiers']> extends never ? undefined : Partial<Record<KeysOfSet<B[BlockName]['modifiers']>, boolean>>),
			elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
				? undefined
				: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
		): string => {
			return bem(blockName, elementNameOrBlockModifiers as any, elementModifiers);
		};

		// Element-gebundener BEM Generator für spezifische Elemente
		blockBem.forElement = <ElementName extends keyof NonNullable<B[BlockName]['elements']>>(elementName: ElementName) => {
			return (
				elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
					? undefined
					: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
			): string => {
				return bem(blockName, elementName, elementModifiers);
			};
		};

		return blockBem;
	};

	type BemFunction = typeof bem & {
		forBlock: typeof bem.forBlock;
	};

	return bem as BemFunction;
}

export { generateBemClassNames };
