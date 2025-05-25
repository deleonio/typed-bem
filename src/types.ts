type NonEmpty<T extends string> = T extends '' ? never : T;

type BemSchema = Record<NonEmpty<string>, { _: NonEmpty<string>; [element: string]: NonEmpty<string> }>;

type BemBlocks<S extends BemSchema> = {
	[B in keyof S]: {
		modifiers: Set<S[B]['_']> | null;
		elements?: {
			[E in Exclude<keyof S[B], '_'>]: {
				modifiers: Set<S[B][E]> | null;
			};
		};
	};
};

export { BemBlocks, BemSchema };
