import type { Item } from './types';

/** Words that keep their own capitals */
const WORDS: Record<string, string> = {
  '2d': '2D',
  '3d': '3D',
  aabb: 'AABB',
  dom: 'DOM',
  gif: 'GIF',
  glsl: 'GLSL',
  gsap: 'GSAP',
  html: 'HTML',
  svg: 'SVG',
  ui: 'UI',
  uv: 'UV',
  xml: 'XML',
};

/** Category names that aren't their id read out */
const LABELS: Record<string, string> = {
  '2d3d': '2D and 3D',
  'nine-slice-sprite': 'Nine-slice sprite',
  post: 'Post-processing',
  scene: 'Scene graph',
  start: 'Getting started',
  three: 'three.js',
};

/** `"svg_custom-data"` → `"SVG custom data"` */
function phrase(slug: string): string {
  const text = slug
    .split(/[_-]/)
    .map((word) => WORDS[word.toLowerCase()] ?? word)
    .join(' ');

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const categoryOf = (item: Pick<Item, 'name'>): string => item.name.split('_')[0];

export const categoryLabel = (id: string): string => LABELS[id] ?? phrase(id);

/** The README's title, else the name without its category: `sprite_transform_rotation` → `Transform rotation` */
export function titleOf(item: Pick<Item, 'name' | 'title'>): string {
  if (item.title) return item.title;
  const [category, ...rest] = item.name.split('_');

  return rest.length ? phrase(rest.join('_')) : categoryLabel(category);
}
