/**
 * Ids whose twin is deliberate, so the recolour check leaves them alone.
 *
 * This is a module rather than a data file so the argument for each case sits
 * next to the case. An allowlist here is not a way to make the number smaller: a
 * pair is allowed when the picture genuinely *is* the word, and anything else on
 * this list would be an excuse. There are two entries because there are two
 * arguments.
 */

/* A colour card is a swatch of that colour. The picture and the word are the
   same thing, so twelve identical shapes in twelve colours is the right answer
   rather than a shortcut. The shapes are all the same on purpose: what
   distinguishes *red* from *blue* is the red and the blue. */
const COLOURS = [
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'pink',
  'purple', 'brown', 'gray', 'silver', 'golden', 'grey', 'turquoise', 'beige',
  'violet', 'indigo', 'magenta', 'cyan', 'lime', 'navy', 'olive', 'maroon',
  'teal', 'aqua', 'crimson', 'scarlet', 'ivory', 'cream', 'tan', 'khaki',
  'charcoal', 'ochre', 'coral', 'salmon', 'peach', 'lilac', 'mint', 'auburn',
  'burgundy', 'chestnut', 'emerald', 'sapphire', 'russet', 'sepia'
];

/* A rhombus is a diamond and an ellipse is an oval. The English words differ
   because the languages disagree about which name is the general one. The
   picture does not, and should not. */
const SAME_SHAPE_TWO_NAMES = ['rhombus', 'rhomboid', 'ovoid', 'ellipse'];

module.exports = [...COLOURS, ...SAME_SHAPE_TWO_NAMES];
