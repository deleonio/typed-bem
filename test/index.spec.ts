import { expect } from 'chai';
import { describe, it } from 'vitest';
import { generateBemClassNames } from '../src/browser';
import type { MyBlocks } from './bem-schema';

describe('typedBem - unified API consistency', () => {
	const bem = generateBemClassNames<MyBlocks>();

	describe('block class generation', () => {
		it('should generate block class name with modifier', () => {
			const expected = 'collapsable collapsable--accordion';
			const blockBem = bem.forBlock('collapsable');

			// All methods should produce identical results
			expect(bem('collapsable', { accordion: true })).to.equal(expected);
			expect(blockBem({ accordion: true })).to.equal(expected);
		});

		it('should generate block class name without modifier', () => {
			const expected = 'collapsable';
			const blockBem = bem.forBlock('collapsable');

			expect(bem('collapsable')).to.equal(expected);
			expect(blockBem()).to.equal(expected);
		});

		it('should handle multiple true modifiers', () => {
			const expected = 'collapsable collapsable--accordion collapsable--details';
			const blockBem = bem.forBlock('collapsable');

			expect(bem('collapsable', { accordion: true, details: true })).to.equal(expected);
			expect(blockBem({ accordion: true, details: true })).to.equal(expected);
		});

		it('should handle multiple false modifiers', () => {
			const expected = 'collapsable';
			const blockBem = bem.forBlock('collapsable');

			expect(bem('collapsable', { accordion: false, details: false })).to.equal(expected);
			expect(blockBem({ accordion: false, details: false })).to.equal(expected);
		});

		it('should handle mixed true and false modifiers', () => {
			const expected = 'collapsable collapsable--accordion';
			const blockBem = bem.forBlock('collapsable');

			expect(bem('collapsable', { accordion: true, details: false })).to.equal(expected);
			expect(blockBem({ accordion: true, details: false })).to.equal(expected);
		});
	});

	describe('element class generation', () => {
		it('should generate element class name with modifier', () => {
			const expected = 'collapsable__button collapsable__button--active';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('button');

			expect(bem('collapsable', 'button', { active: true })).to.equal(expected);
			expect(blockBem('button', { active: true })).to.equal(expected);
			expect(elementBem({ active: true })).to.equal(expected);
		});

		it('should generate element class name without modifier', () => {
			const expected = 'collapsable__content';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('content');

			expect(bem('collapsable', 'content')).to.equal(expected);
			expect(blockBem('content')).to.equal(expected);
			expect(elementBem()).to.equal(expected);
		});

		it('should ignore false modifiers', () => {
			const expected = 'collapsable__button collapsable__button--disabled';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('button');

			expect(bem('collapsable', 'button', { active: false, disabled: true })).to.equal(expected);
			expect(blockBem('button', { active: false, disabled: true })).to.equal(expected);
			expect(elementBem({ active: false, disabled: true })).to.equal(expected);
		});

		it('should handle element with multiple true modifiers', () => {
			const expected = 'collapsable__button collapsable__button--active collapsable__button--disabled';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('button');

			expect(bem('collapsable', 'button', { active: true, disabled: true })).to.equal(expected);
			expect(blockBem('button', { active: true, disabled: true })).to.equal(expected);
			expect(elementBem({ active: true, disabled: true })).to.equal(expected);
		});

		it('should handle element with multiple false modifiers', () => {
			const expected = 'collapsable__button';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('button');

			expect(bem('collapsable', 'button', { active: false, disabled: false })).to.equal(expected);
			expect(blockBem('button', { active: false, disabled: false })).to.equal(expected);
			expect(elementBem({ active: false, disabled: false })).to.equal(expected);
		});

		it('should handle element with mixed true and false modifiers', () => {
			const expected = 'collapsable__button collapsable__button--active';
			const blockBem = bem.forBlock('collapsable');
			const elementBem = blockBem.forElement('button');

			expect(bem('collapsable', 'button', { active: true, disabled: false })).to.equal(expected);
			expect(blockBem('button', { active: true, disabled: false })).to.equal(expected);
			expect(elementBem({ active: true, disabled: false })).to.equal(expected);
		});
	});

	describe('header block tests', () => {
		it('should generate header block class name', () => {
			const expected = 'header';
			const blockBem = bem.forBlock('header');

			expect(bem('header')).to.equal(expected);
			expect(blockBem()).to.equal(expected);
		});

		it('should generate header element class name with modifier', () => {
			const expected = 'header__title header__title--large';
			const blockBem = bem.forBlock('header');
			const elementBem = blockBem.forElement('title');

			expect(bem('header', 'title', { large: true })).to.equal(expected);
			expect(blockBem('title', { large: true })).to.equal(expected);
			expect(elementBem({ large: true })).to.equal(expected);
		});

		it('should generate header element class name without modifier', () => {
			const expected = 'header__nav';
			const blockBem = bem.forBlock('header');
			const elementBem = blockBem.forElement('nav');

			expect(bem('header', 'nav')).to.equal(expected);
			expect(blockBem('nav')).to.equal(expected);
			expect(elementBem()).to.equal(expected);
		});

		it('should handle multiple modifiers for header title', () => {
			const expected = 'header__title header__title--large header__title--small';
			const blockBem = bem.forBlock('header');
			const elementBem = blockBem.forElement('title');

			expect(bem('header', 'title', { large: true, small: true })).to.equal(expected);
			expect(blockBem('title', { large: true, small: true })).to.equal(expected);
			expect(elementBem({ large: true, small: true })).to.equal(expected);
		});
	});

	describe('footer block tests', () => {
		it('should generate footer block class name', () => {
			const expected = 'footer';
			const blockBem = bem.forBlock('footer');

			expect(bem('footer')).to.equal(expected);
			expect(blockBem()).to.equal(expected);
		});

		it('should generate footer element class name with modifier', () => {
			const expected = 'footer__link footer__link--visited';
			const blockBem = bem.forBlock('footer');
			const elementBem = blockBem.forElement('link');

			expect(bem('footer', 'link', { visited: true })).to.equal(expected);
			expect(blockBem('link', { visited: true })).to.equal(expected);
			expect(elementBem({ visited: true })).to.equal(expected);
		});

		it('should generate footer element class name without modifier', () => {
			const expected = 'footer__info';
			const blockBem = bem.forBlock('footer');
			const elementBem = blockBem.forElement('info');

			expect(bem('footer', 'info')).to.equal(expected);
			expect(blockBem('info')).to.equal(expected);
			expect(elementBem()).to.equal(expected);
		});

		it('should handle element with multiple true modifiers for footer', () => {
			const expected = 'footer__info footer__info--detailed footer__info--summary';
			const blockBem = bem.forBlock('footer');
			const elementBem = blockBem.forElement('info');

			expect(bem('footer', 'info', { detailed: true, summary: true })).to.equal(expected);
			expect(blockBem('info', { detailed: true, summary: true })).to.equal(expected);
			expect(elementBem({ detailed: true, summary: true })).to.equal(expected);
		});

		it('should handle element with multiple false modifiers for footer', () => {
			const expected = 'footer__info';
			const blockBem = bem.forBlock('footer');
			const elementBem = blockBem.forElement('info');

			expect(bem('footer', 'info', { detailed: false, summary: false })).to.equal(expected);
			expect(blockBem('info', { detailed: false, summary: false })).to.equal(expected);
			expect(elementBem({ detailed: false, summary: false })).to.equal(expected);
		});

		it('should handle element with mixed true and false modifiers for footer', () => {
			const expected = 'footer__info footer__info--detailed';
			const blockBem = bem.forBlock('footer');
			const elementBem = blockBem.forElement('info');

			expect(bem('footer', 'info', { detailed: true, summary: false })).to.equal(expected);
			expect(blockBem('info', { detailed: true, summary: false })).to.equal(expected);
			expect(elementBem({ detailed: true, summary: false })).to.equal(expected);
		});
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
