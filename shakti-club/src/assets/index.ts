/* Bundled image assets. Importing (rather than referencing /public paths) lets
   Vite fingerprint them for the web build and inline them as data URIs for the
   single-file artifact build. */

import logoMark from './logo-mark.png';
import logoMarkWhite from './logo-mark-white.png';

import dsc09043 from './products/dsc09043.jpg';
import dsc09044 from './products/dsc09044.jpg';
import dsc09048 from './products/dsc09048.jpg';
import dsc09053 from './products/dsc09053.jpg';
import dsc09058 from './products/dsc09058.jpg';
import dsc09060 from './products/dsc09060.jpg';
import dsc09078 from './products/dsc09078.jpg';
import dsc09079 from './products/dsc09079.jpg';

export { logoMark, logoMarkWhite };

export const PRODUCT_IMAGES: Record<string, string> = {
  dsc09043,
  dsc09044,
  dsc09048,
  dsc09053,
  dsc09058,
  dsc09060,
  dsc09078,
  dsc09079,
};
