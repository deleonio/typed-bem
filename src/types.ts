/**
 * A utility type to conditionally set a type to `null` if it is an empty string.
 */
type NonEmptyString<T extends string> = T extends '' ? null : T;

/**
 * A utility type to conditionally set a type to `undefined` if it is `null`.
 */
type IfNullThenUndefined<C, T> = C extends null ? undefined : T;

/**
 * A type representing the structure of the BEM modifiers.
 */
type BemModifiers = {
	modifiers: Set<string | NonEmptyString<''>> | null;
};

/**
 * A type representing the structure of the BEM elements and modifiers.
 */
type BemElements = {
	[elementName: string /* | NonEmptyString<''> (?) */]: BemModifiers;
};

/**
 * A type representing the structure of the BEM blocks, elements, and modifiers.
 */
type BemBlocks = {
	[blockName: string /* | NonEmptyString<''> (?) */]: BemModifiers & {
		elements?: BemElements;
	};
};

export { BemBlocks, IfNullThenUndefined };
