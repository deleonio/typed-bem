import { generateBemScssFile } from '../node/scss';
import { alertBem } from './const';

// Generate SCSS file without layer (original behavior)
generateBemScssFile(alertBem, './alert');

// Generate SCSS file with CSS layer
generateBemScssFile(alertBem, './alert-with-layer', { layer: 'components' });
