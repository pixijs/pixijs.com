import { useEffect, useState } from 'react';
import examples2d from '@site/src/data/generated/examples.json';
import examples3d from '@site/src/data/generated/examples-3d.json';

import type { Item } from './types';
import type { PackageId } from '@site/src/data/packages';
import type { SourceFiles } from '@site/src/runtime/compile';

/** Every example of both packages, including hidden ones, which open only by `?example=` or `<PixiExample>` */
const examples = [...examples2d, ...examples3d] as Item[];

/** Gallery order: first steps first, then the rest; categories not listed follow alphabetically */
const CATEGORY_ORDER: Record<PackageId, string[]> = {
  '2d': [
    'sprite',
    'container',
    'graphics',
    'text',
    'events',
    'assets',
    'animated-sprite',
    'tiling-sprite',
    'nine-slice-sprite',
    'particle-container',
    'mesh',
    'filters',
    'rendering',
    'gsap',
    'app',
    'dom-container',
    'offscreen-canvas',
    'three',
    'misc',
  ],
  '3d': [
    'basics',
    '2d-and-3d',
    'models',
    'animation',
    'materials',
    'lighting',
    'cameras',
    'interaction',
    'particles',
    'post-processing',
    'performance',
    'showcase',
  ],
};

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
  'nine-slice-sprite': 'Nine-slice sprite',
  'post-processing': 'Post-processing',
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

export interface Category {
  id: string;
  label: string;
  examples: Item[];
}

export const categoryOf = (item: Item): string => item.name.split('_')[0];

export const categoryLabel = (id: string): string => LABELS[id] ?? phrase(id);

/** The example's name without its category: `sprite_transform_rotation` → `Transform rotation` */
export function titleOf(item: Item): string {
  const [category, ...rest] = item.name.split('_');

  return rest.length ? phrase(rest.join('_')) : categoryLabel(category);
}

/** The examples a package's gallery lists, grouped by category in gallery order */
export function galleryCategories(pkg: PackageId): Category[] {
  const groups = new Map<string, Item[]>();

  for (const item of examples) {
    if (item.pkg !== pkg || item.hidden) continue;
    const id = categoryOf(item);

    groups.set(id, [...(groups.get(id) ?? []), item]);
  }
  const order = CATEGORY_ORDER[pkg];
  const rank = (id: string) => (order.includes(id) ? order.indexOf(id) : order.length);

  return [...groups.keys()]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((id) => ({ id, label: categoryLabel(id), examples: groups.get(id) ?? [] }));
}

export function getExample(name: string, pkg: Item['pkg'] = '2d'): Item | undefined {
  return examples.find((example) => example.name === name && example.pkg === pkg);
}

/** Preview images (`scripts/capture-example-previews.mjs`): a 600 × 338 still, or a 320 × 180 animated loop */
export function previewOf(item: Item, animated = false): string {
  return `/examples/previews/${item.pkg === '3d' ? '3d/' : ''}${item.name}${animated ? '' : '_thumbnail'}.webp`;
}

/** The still that stands in until the example runs; hidden examples have none */
export const posterOf = (item: Item): string | undefined => (item.hidden ? undefined : previewOf(item));

/**
 * The examples matching every word of `query` in their name, category, description or dependencies, best first:
 * matches in the name rank above matches in the description only
 */
export function searchExamples(items: Item[], query: string): Item[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return items;

  return items
    .map((item) => {
      const name =
        `${item.name.replace(/[_-]/g, ' ')} ${titleOf(item)} ${categoryLabel(categoryOf(item))}`.toLowerCase();
      const text = `${item.description} ${Object.keys(item.dependencies).join(' ')}`.toLowerCase();
      const score = terms.reduce(
        (sum, term) => (sum < 0 ? sum : name.includes(term) ? sum + 2 : text.includes(term) ? sum + 1 : -1),
        0,
      );

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/** Fetches every file of `example`, keyed by file name */
export async function fetchExampleFiles(example: Item): Promise<Record<string, string>> {
  const folder = example.pkg === '3d' ? '/examples/source/3d/' : '/examples/source/';
  const entries = await Promise.all(
    example.files.map(async (file) => {
      const response = await fetch(folder + file.location);

      if (!response.ok) throw new Error(`Failed to fetch ${file.location}`);

      return [file.name, await response.text()] as const;
    }),
  );

  return Object.fromEntries(entries);
}

/** The files of `example`, fetched once `enabled`; `failure` says why they didn't load */
export function useExampleFiles(example: Item | undefined, enabled = true) {
  const [loaded, setLoaded] = useState<{ example: Item; files?: SourceFiles; failure?: string }>();
  const current = loaded?.example === example ? loaded : undefined;

  useEffect(() => {
    if (!example || !enabled || current) return undefined;
    let stale = false;

    fetchExampleFiles(example).then(
      (files) => !stale && setLoaded({ example, files }),
      (error: unknown) =>
        !stale && setLoaded({ example, failure: error instanceof Error ? error.message : "The example didn't load" }),
    );

    return () => {
      stale = true;
    };
  }, [example, enabled, current]);

  return { files: current?.files, failure: current?.failure };
}
