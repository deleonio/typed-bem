import { generateBemScssFile } from '../node/scss';
import { alertBem } from './const';

// Generate SCSS file
generateBemScssFile(alertBem, './alert.scss');
