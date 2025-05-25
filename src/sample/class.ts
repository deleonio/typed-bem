import { generateBemClassNames } from '../class';
import { AlertBem } from './type';

// Generate Class Names
const alertBemNames = generateBemClassNames<AlertBem>();
console.log(
	alertBemNames('alert', 'container-heading', {
		h3: true,
	}),
);
// console.log(
// 	alertBemNames('alert', {
// 		egal: true,
// 	}),
// );
// console.log(
// 	alertBemNames('alert', 'container-heading', {
// 		card: true,
// 	}),
// );
