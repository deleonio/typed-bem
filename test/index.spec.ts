import { expect } from 'chai';
import { describe, it } from 'vitest';
import { generateBemClassNames } from '../src/browser';
import type { MyBlocks } from './bem-schema';

describe('typedBem', () => {
	const bem = generateBemClassNames<MyBlocks>();

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

describe('forBlock generators', () => {
	const bem = generateBemClassNames<MyBlocks>();

	// Tests for collapsable block
	describe('collapsable block', () => {
		const collapsableBem = bem.forBlock('collapsable');

		it('should generate block class name with modifier', () => {
			const result = collapsableBem({ accordion: true });
			expect(result).to.equal('collapsable collapsable--accordion');
		});

		it('should generate element class name with modifier', () => {
			const result = collapsableBem('button', { active: true });
			expect(result).to.equal('collapsable__button collapsable__button--active');
		});

		it('should generate block class name without modifier', () => {
			const result = collapsableBem();
			expect(result).to.equal('collapsable');
		});

		it('should generate element class name without modifier', () => {
			const result = collapsableBem('content');
			expect(result).to.equal('collapsable__content');
		});

		it('should ignore false modifiers', () => {
			const result = collapsableBem('button', { active: false, disabled: true });
			expect(result).to.equal('collapsable__button collapsable__button--disabled');
		});

		it('should handle multiple true modifiers', () => {
			const result = collapsableBem({ accordion: true, details: true });
			expect(result).to.equal('collapsable collapsable--accordion collapsable--details');
		});

		it('should handle multiple false modifiers', () => {
			const result = collapsableBem({ accordion: false, details: false });
			expect(result).to.equal('collapsable');
		});

		it('should handle mixed true and false modifiers', () => {
			const result = collapsableBem({ accordion: true, details: false });
			expect(result).to.equal('collapsable collapsable--accordion');
		});

		it('should handle element with multiple true modifiers', () => {
			const result = collapsableBem('button', { active: true, disabled: true });
			expect(result).to.equal('collapsable__button collapsable__button--active collapsable__button--disabled');
		});

		it('should handle element with multiple false modifiers', () => {
			const result = collapsableBem('button', { active: false, disabled: false });
			expect(result).to.equal('collapsable__button');
		});

		it('should handle element with mixed true and false modifiers', () => {
			const result = collapsableBem('button', { active: true, disabled: false });
			expect(result).to.equal('collapsable__button collapsable__button--active');
		});
	});

	// Tests for header block
	describe('header block', () => {
		const headerBem = bem.forBlock('header');

		it('should generate block class name', () => {
			const result = headerBem();
			expect(result).to.equal('header');
		});

		it('should generate element class name with modifier', () => {
			const result = headerBem('title', { large: true });
			expect(result).to.equal('header__title header__title--large');
		});

		it('should generate element class name without modifier', () => {
			const result = headerBem('nav');
			expect(result).to.equal('header__nav');
		});

		it('should handle mixed true and false modifiers', () => {
			const result = headerBem('title', { large: true });
			expect(result).to.equal('header__title header__title--large');
		});
	});

	// Tests for footer block
	describe('footer block', () => {
		const footerBem = bem.forBlock('footer');

		it('should generate block class name', () => {
			const result = footerBem();
			expect(result).to.equal('footer');
		});

		it('should generate element class name with modifier', () => {
			const result = footerBem('link', { visited: true });
			expect(result).to.equal('footer__link footer__link--visited');
		});

		it('should generate element class name without modifier', () => {
			const result = footerBem('info');
			expect(result).to.equal('footer__info');
		});

		it('should handle element with multiple true modifiers', () => {
			const result = footerBem('info', { detailed: true, summary: true });
			expect(result).to.equal('footer__info footer__info--detailed footer__info--summary');
		});

		it('should handle element with multiple false modifiers', () => {
			const result = footerBem('info', { detailed: false, summary: false });
			expect(result).to.equal('footer__info');
		});

		it('should handle element with mixed true and false modifiers', () => {
			const result = footerBem('info', { detailed: true, summary: false });
			expect(result).to.equal('footer__info footer__info--detailed');
		});
	});
});

describe('forElement generators', () => {
	const bem = generateBemClassNames<MyBlocks>();

	// Tests for collapsable block elements
	describe('collapsable block elements', () => {
		const collapsableBem = bem.forBlock('collapsable');

		describe('button element', () => {
			const buttonBem = collapsableBem.forElement('button');

			it('should generate element class name with modifier', () => {
				const result = buttonBem({ active: true });
				expect(result).to.equal('collapsable__button collapsable__button--active');
			});

			it('should generate element class name without modifier', () => {
				const result = buttonBem();
				expect(result).to.equal('collapsable__button');
			});

			it('should ignore false modifiers', () => {
				const result = buttonBem({ active: false, disabled: true });
				expect(result).to.equal('collapsable__button collapsable__button--disabled');
			});

			it('should handle multiple true modifiers', () => {
				const result = buttonBem({ active: true, disabled: true });
				expect(result).to.equal('collapsable__button collapsable__button--active collapsable__button--disabled');
			});

			it('should handle multiple false modifiers', () => {
				const result = buttonBem({ active: false, disabled: false });
				expect(result).to.equal('collapsable__button');
			});

			it('should handle mixed true and false modifiers', () => {
				const result = buttonBem({ active: true, disabled: false });
				expect(result).to.equal('collapsable__button collapsable__button--active');
			});
		});

		describe('content element', () => {
			const contentBem = collapsableBem.forElement('content');

			it('should generate element class name with modifier', () => {
				const result = contentBem({ block: true });
				expect(result).to.equal('collapsable__content collapsable__content--block');
			});

			it('should generate element class name without modifier', () => {
				const result = contentBem();
				expect(result).to.equal('collapsable__content');
			});

			it('should handle multiple true modifiers', () => {
				const result = contentBem({ block: true, inline: true });
				expect(result).to.equal('collapsable__content collapsable__content--block collapsable__content--inline');
			});

			it('should handle multiple false modifiers', () => {
				const result = contentBem({ block: false, inline: false });
				expect(result).to.equal('collapsable__content');
			});

			it('should handle mixed true and false modifiers', () => {
				const result = contentBem({ block: true, inline: false });
				expect(result).to.equal('collapsable__content collapsable__content--block');
			});
		});
	});

	// Tests for header block elements
	describe('header block elements', () => {
		const headerBem = bem.forBlock('header');

		describe('title element', () => {
			const titleBem = headerBem.forElement('title');

			it('should generate element class name with modifier', () => {
				const result = titleBem({ large: true });
				expect(result).to.equal('header__title header__title--large');
			});

			it('should generate element class name without modifier', () => {
				const result = titleBem();
				expect(result).to.equal('header__title');
			});

			it('should handle multiple true modifiers', () => {
				const result = titleBem({ large: true, small: true });
				expect(result).to.equal('header__title header__title--large header__title--small');
			});

			it('should handle multiple false modifiers', () => {
				const result = titleBem({ large: false, small: false });
				expect(result).to.equal('header__title');
			});

			it('should handle mixed true and false modifiers', () => {
				const result = titleBem({ large: true, small: false });
				expect(result).to.equal('header__title header__title--large');
			});
		});

		describe('nav element', () => {
			const navBem = headerBem.forElement('nav');

			it('should generate element class name without modifier', () => {
				const result = navBem();
				expect(result).to.equal('header__nav');
			});
		});
	});

	// Tests for footer block elements
	describe('footer block elements', () => {
		const footerBem = bem.forBlock('footer');

		describe('link element', () => {
			const linkBem = footerBem.forElement('link');

			it('should generate element class name with modifier', () => {
				const result = linkBem({ visited: true });
				expect(result).to.equal('footer__link footer__link--visited');
			});

			it('should generate element class name without modifier', () => {
				const result = linkBem();
				expect(result).to.equal('footer__link');
			});

			it('should handle multiple true modifiers', () => {
				const result = linkBem({ visited: true, unvisited: true });
				expect(result).to.equal('footer__link footer__link--visited footer__link--unvisited');
			});

			it('should handle multiple false modifiers', () => {
				const result = linkBem({ visited: false, unvisited: false });
				expect(result).to.equal('footer__link');
			});

			it('should handle mixed true and false modifiers', () => {
				const result = linkBem({ visited: true, unvisited: false });
				expect(result).to.equal('footer__link footer__link--visited');
			});
		});

		describe('info element', () => {
			const infoBem = footerBem.forElement('info');

			it('should generate element class name with modifier', () => {
				const result = infoBem({ detailed: true });
				expect(result).to.equal('footer__info footer__info--detailed');
			});

			it('should generate element class name without modifier', () => {
				const result = infoBem();
				expect(result).to.equal('footer__info');
			});

			it('should handle multiple true modifiers', () => {
				const result = infoBem({ detailed: true, summary: true });
				expect(result).to.equal('footer__info footer__info--detailed footer__info--summary');
			});

			it('should handle multiple false modifiers', () => {
				const result = infoBem({ detailed: false, summary: false });
				expect(result).to.equal('footer__info');
			});

			it('should handle mixed true and false modifiers', () => {
				const result = infoBem({ detailed: true, summary: false });
				expect(result).to.equal('footer__info footer__info--detailed');
			});
		});
	});
});
