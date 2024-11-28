import { expect } from 'chai';
import bem from '../src/index';
import { beforeAll, describe, it } from 'vitest';

describe('bem', () => {
	describe('common loose mode', () => {
		const myBem = bem('collapsable', ['accordion', 'details'] as const, {
			button: ['active', 'disabled'] as const,
			content: ['block', 'inline'] as const,
		});

		it('should generate class for button with active modifier', () => {
			const result = myBem('button', { active: true });
			expect(result).to.equal('collapsable__button collapsable__button--active');
		});

		it('should generate class for content with block and inline modifiers', () => {
			const result = myBem('content', { block: true, inline: true });
			expect(result).to.equal('collapsable__content collapsable__content--block collapsable__content--inline');
		});

		it('should generate class for button with no modifiers', () => {
			const result = myBem('button', {});
			expect(result).to.equal('collapsable__button');
		});

		it('should generate class for content with no modifiers', () => {
			const result = myBem('content', {});
			expect(result).to.equal('collapsable__content');
		});

		it('should ignore false modifiers', () => {
			const result = myBem('button', { active: false, disabled: true });
			expect(result).to.equal('collapsable__button collapsable__button--disabled');
		});

		it('should throw an error for empty block name', () => {
			expect(() =>
				bem('', [] as const, {
					button: ['active'] as const,
				}),
			).to.throws('Block name must be a string and not empty!');
		});

		it('should throw an error for empty element name', () => {
			expect(() =>
				bem('collapsable', [] as const, {
					'': ['active'] as const,
				}),
			).to.throws('Element names from the block "collapsable" must be a string and not empty!');
		});

		it('should throw an error for empty modifier name', () => {
			expect(() =>
				bem('collapsable', [] as const, {
					button: [''] as const,
				}),
			).to.throws('Modifier names of element "button" from the block "collapsable" must be a string!');
		});

		it('should not throw if we have no elements', () => {
			expect(() => bem('collapsable')).to.not.throw();
		});

		it('should not throw if we have no modifiers', () => {
			expect(() => bem('collapsable')).to.not.throw();
		});

		it('should give block class name', () => {
			expect(myBem()).to.equal('collapsable');
		});

		it('should give block element class name', () => {
			expect(myBem('button')).to.equal('collapsable__button');
		});

		it('should give only block class name, if element name is undefined and modifiers are set', () => {
			expect(
				myBem(undefined, {
					inline: true,
				}),
			).to.equal('collapsable');
		});

		it('should generate class for block with accordion modifier', () => {
			const result = myBem({ accordion: true });
			expect(result).to.equal('collapsable collapsable--accordion');
		});

		it('should generate class for block with details modifier', () => {
			const result = myBem({ details: true });
			expect(result).to.equal('collapsable collapsable--details');
		});

		it('should generate class for block with multiple modifiers', () => {
			const result = myBem({ accordion: true, details: true });
			expect(result).to.equal('collapsable collapsable--accordion collapsable--details');
		});

		it('should generate class for block with no modifiers', () => {
			const result = myBem({});
			expect(result).to.equal('collapsable');
		});

		it('should ignore false block modifiers', () => {
			const result = myBem({ accordion: false, details: true });
			expect(result).to.equal('collapsable collapsable--details');
		});

		it('should generate class for block with no modifiers when empty object is passed', () => {
			const result = myBem({});
			expect(result).to.equal('collapsable');
		});

		it('should generate class for block with no modifiers when undefined is passed', () => {
			const result = myBem(undefined);
			expect(result).to.equal('collapsable');
		});
	});

	describe('strict mode', () => {
		const myBem = bem(
			'collapsable',
			['accordion', 'details'] as const,
			{
				button: ['active', 'disabled'] as const,
				content: ['block', 'inline'] as const,
			},
			{
				validation: 'strict',
			},
		);

		it('should throw an error for invalid block modifier name', () => {
			expect(() => myBem({ invalidModifier: true })).to.throws('Modifier "invalidModifier" is not defined in block "collapsable"!');
		});

		it('should throw an error for invalid element name', () => {
			expect(() => myBem('invalidElement' as any, {})).to.throws('Element "invalidElement" is not defined in block "collapsable"!');
		});

		it('should throw an error for invalid modifier name', () => {
			expect(() => myBem('button', { invalidModifier: true })).to.throws(
				'Modifier "invalidModifier" is not defined in element "button" of block "collapsable"!',
			);
		});

		it('should throw an error for partially invalid modifiers', () => {
			expect(() => myBem('content', { block: true, invalidModifier: true })).to.throws(
				'Modifier "invalidModifier" is not defined in element "content" of block "collapsable"!',
			);
		});
	});
});
