import { generateBemScssFile } from '../generators/scss';
import { alertBem } from './const';

// Generate SCSS file
generateBemScssFile(alertBem, './alert.scss');
