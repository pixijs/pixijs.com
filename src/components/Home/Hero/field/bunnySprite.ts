/**
 * The hero's bunny, on the PixiJS bunny's own 26 by 37 grid, one character a pixel from the top: a black outline, and
 * flat gold in three tones, lit from the top right. `scripts/render-bunny.mjs` traces its silhouette and renders its
 * poster images; edit the sprite here, then run it.
 */
export const BUNNY_PALETTE: Record<string, string> = {
  /** The bunny's outline, its gold fur in shadow, base and highlight, and its white */
  A: '000000',
  E: '855e03',
  B: 'b88304',
  C: 'eba605',
  D: 'ffffff',
};

/** The PixiJS bunny, `static/examples/assets/bunny.png`, pixel for pixel */
export const BUNNY_SPRITE: string[] = [
  '......AAAAA....AAAAA......',
  '.....ABCCCCA..ACCCCCA.....',
  '.....ABDDDCA..ABDDDCA.....',
  '.....ABDDDCA..ABDDDCA.....',
  '.....ABDDDCA..ABDDDCA.....',
  '.....ABDDDBA..ABDDDCA.....',
  '.....ABBDBBBAABBBDBCA.....',
  '.....ABBBBBBBBBBBBBCA.....',
  '.....ABBBBBBBBBBBBBCA.....',
  '.....ABBBBBBBBBBBBBCA.....',
  '.....ABBBABBBBBBABBCA.....',
  '.....ABBBABBBBBBABBCA.....',
  '.....ABBBBBBBBBBBBBCA.....',
  '.....ABBBBBAAAABBBBCA.....',
  '.AAAABBBBBBBDDBBBBBBCAAAA.',
  'AEEEEBBBBBBBDDBBBBBBBCCCCA',
  'AEEEEEBBBBBBBBBBBBBBBBBBBA',
  '.AAAAEEBBBBBBBBBBBBBBAAAA.',
  '.....AEEBBBCCCCCBBBBA.....',
  '.....AEEBBCDDDDDCCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBCDDDDDDDCBBA.....',
  '.....AEEBBCDDDDDCBBBA.....',
  '.....AEEBBBCCCCCBBBBA.....',
  '.....AEEBBBBBBBBBBBBA.....',
  '.....AEEBBBEEEEEEBBBA.....',
  '.....AEEBBEEEEEEEEBBA.....',
  '.....AEEBAAAAAAAAEEBA.....',
  '.....AEEA........AEEA.....',
  '.....AEEA........AEEA.....',
  '.....AEEA........AEEA.....',
  '.....AEEA........AEEA.....',
  '......AA..........AA......',
];
