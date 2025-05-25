import { default as easyBem } from 'easy-bem';
import { BemBlocks, BemSchema } from '../types';

type KeysOfSet<T> = T extends Set<infer U> ? U : never;

function generateBemClassNames<B extends BemBlocks<BemSchema>>() {
	const bemBlocks = new Map<string, ReturnType<typeof easyBem>>();

	return <BlockName extends keyof B, ElementName extends keyof NonNullable<B[BlockName]['elements']>>(
		blockName: BlockName,

		// Block-Modifier oder Element-Name
		blockModifiersOrElementName?:
			| (KeysOfSet<B[BlockName]['modifiers']> extends never ? undefined : Partial<Record<KeysOfSet<B[BlockName]['modifiers']>, boolean>>)
			| ElementName,

		// Element-Modifier, wenn ein Element angegeben wurde
		elementModifiers?: KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']> extends never
			? undefined
			: Partial<Record<KeysOfSet<NonNullable<B[BlockName]['elements']>[ElementName]['modifiers']>, boolean>>,
	) => {
		try {
			return bemBlocks.get(blockName as string)!(blockModifiersOrElementName as string, elementModifiers);
		} catch {
			return bemBlocks.set(blockName as string, easyBem(blockName as string)).get(blockName as string)!(
				blockModifiersOrElementName as string,
				elementModifiers,
			);
		}
	};
}

export { generateBemClassNames };
