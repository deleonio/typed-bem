import { expect } from 'chai';
import { describe, it } from 'vitest';
import typedBem from '../src/index';

type MyBlocks = {
	collapsable: {
		modifiers: 'accordion' | 'details';
		elements: {
			button: {
				modifiers: 'active' | 'disabled';
			};
			content: {
				modifiers: 'block' | 'inline';
			};
		};
	};
	header: {
		modifiers: null;
		elements: {
			title: {
				modifiers: 'large' | 'small';
			};
			nav: {
				modifiers: null;
			};
		};
	};
	footer: {
		modifiers: null;
		elements: {
			link: {
				modifiers: 'visited' | 'unvisited';
			};
			info: {
				modifiers: 'detailed' | 'summary';
			};
		};
	};
};

describe('typedBem', () => {
	const bem = typedBem<MyBlocks>();

	it('should generate block class name with modifier', () => {
		const result = bem('collapsable', { accordion: true });
		expect(result).to.equal('collapsable collapsable--accordion');
	});

	it('should generate element class name with modifier', () => {
		const result = bem('collapsable', 'button', { active: true });
		expect(result).to.equal('collapsable__button collapsable__button--active');
	});

	it('should generate block class name without modifier', () => {
		const result = bem('collapsable');
		expect(result).to.equal('collapsable');
	});

	it('should generate element class name without modifier', () => {
		const result = bem('collapsable', 'content');
		expect(result).to.equal('collapsable__content');
	});

	it('should ignore false modifiers', () => {
		const result = bem('collapsable', 'button', { active: false, disabled: true });
		expect(result).to.equal('collapsable__button collapsable__button--disabled');
	});

	it('should handle multiple true modifiers', () => {
		const result = bem('collapsable', { accordion: true, details: true });
		expect(result).to.equal('collapsable collapsable--accordion collapsable--details');
	});

	it('should handle multiple false modifiers', () => {
		const result = bem('collapsable', { accordion: false, details: false });
		expect(result).to.equal('collapsable');
	});

	it('should handle mixed true and false modifiers', () => {
		const result = bem('collapsable', { accordion: true, details: false });
		expect(result).to.equal('collapsable collapsable--accordion');
	});

	it('should handle element with multiple true modifiers', () => {
		const result = bem('collapsable', 'button', { active: true, disabled: true });
		expect(result).to.equal('collapsable__button collapsable__button--active collapsable__button--disabled');
	});

	it('should handle element with multiple false modifiers', () => {
		const result = bem('collapsable', 'button', { active: false, disabled: false });
		expect(result).to.equal('collapsable__button');
	});

	it('should handle element with mixed true and false modifiers', () => {
		const result = bem('collapsable', 'button', { active: true, disabled: false });
		expect(result).to.equal('collapsable__button collapsable__button--active');
	});

	it('should generate header block class name with modifier', () => {
		const result = bem('header');
		expect(result).to.equal('header');
	});

	it('should generate header element class name with modifier', () => {
		const result = bem('header', 'title', { large: true });
		expect(result).to.equal('header__title header__title--large');
	});

	it('should generate footer block class name without modifier', () => {
		const result = bem('footer');
		expect(result).to.equal('footer');
	});

	it('should generate footer element class name with modifier', () => {
		const result = bem('footer', 'link', { visited: true });
		expect(result).to.equal('footer__link footer__link--visited');
	});

	it('should generate header element class name without modifier', () => {
		const result = bem('header', 'nav');
		expect(result).to.equal('header__nav');
	});

	it('should generate footer element class name without modifier', () => {
		const result = bem('footer', 'info');
		expect(result).to.equal('footer__info');
	});

	it('should handle multiple true modifiers for header', () => {
		const result = bem('header', 'nav');
		expect(result).to.equal('header__nav');
	});

	it('should handle multiple false modifiers for header', () => {
		const result = bem('header', 'title');
		expect(result).to.equal('header__title');
	});

	it('should handle mixed true and false modifiers for header', () => {
		const result = bem('header', 'title', {
			large: true,
		});
		expect(result).to.equal('header__title header__title--large');
	});

	it('should handle element with multiple true modifiers for footer', () => {
		const result = bem('footer', 'info', { detailed: true, summary: true });
		expect(result).to.equal('footer__info footer__info--detailed footer__info--summary');
	});

	it('should handle element with multiple false modifiers for footer', () => {
		const result = bem('footer', 'info', { detailed: false, summary: false });
		expect(result).to.equal('footer__info');
	});

	it('should handle element with mixed true and false modifiers for footer', () => {
		const result = bem('footer', 'info', { detailed: true, summary: false });
		expect(result).to.equal('footer__info footer__info--detailed');
	});
});
