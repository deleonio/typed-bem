export type MyBlocks = {
	collapsable: {
		modifiers: Set<'accordion' | 'details'>;
		elements: {
			button: {
				modifiers: Set<'active' | 'disabled'>;
			};
			content: {
				modifiers: Set<'block' | 'inline'>;
			};
		};
	};
	header: {
		modifiers: never;
		elements: {
			title: {
				modifiers: Set<'large' | 'small'>;
			};
			nav: {
				modifiers: never;
			};
		};
	};
	footer: {
		modifiers: never;
		elements: {
			link: {
				modifiers: Set<'visited' | 'unvisited'>;
			};
			info: {
				modifiers: Set<'detailed' | 'summary'>;
			};
		};
	};
};
