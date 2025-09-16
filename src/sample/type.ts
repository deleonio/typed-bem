export type AlertBem = {
	alert: {
		elements: {
			container: {
				modifiers: null;
			};
			'container-content': {
				modifiers: null;
			};
			'container-heading': {
				modifiers: Set<'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
			};
			'close-button': {
				modifiers: Set<'close'>;
			};
			content: {
				modifiers: null;
			};
			heading: {
				modifiers: null;
			};
		};
		modifiers: Set<'msg' | 'card' | 'hasCloser' | 'default' | 'error' | 'info' | 'warning' | 'success' | 'variant'>;
	};
};
