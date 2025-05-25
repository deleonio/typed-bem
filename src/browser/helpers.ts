function uniqueClassNames(...chunks: (string | undefined | null | false)[]): string {
	const set = new Set<string>();
	for (const chunk of chunks) {
		if (!chunk) continue;
		for (const cls of chunk.split(/\s+/)) set.add(cls);
	}
	return [...set].join(' ');
}

export { uniqueClassNames };
