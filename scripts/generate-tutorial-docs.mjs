#!/usr/bin/env node
// Writes one page per site-owned 2D tutorial from `src/tutorials/<set>/tutorialsData.json`. Each page imports its
// tutorial's steps from `src/tutorials/<set>/<camelCaseId>`, so they load with that route only. 3D tutorial pages
// come from `scripts/pixi-docs.mts 3d`.
import { readFileSync } from 'fs';
import { join } from 'path';
import { prune, tutorialPage, writeIfChanged } from './shared.mts';

const tutorialSets = [
  { docs: 'docs', set: 'v8.0.0' },
  { docs: 'versioned_docs/version-7.x', set: 'v7.0.0' },
];

const toCamelCase = (id) => id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());

for (const { docs, set } of tutorialSets) {
  const dir = join(process.cwd(), docs, 'tutorials');
  const tutorials = JSON.parse(readFileSync(join(process.cwd(), 'src/tutorials', set, 'tutorialsData.json'), 'utf8'));
  const keep = new Set([join(dir, 'index.md')]);
  let written = 0;

  for (const { id, title, description } of tutorials) {
    const file = join(dir, `${id}.md`);
    const content = `@site/src/tutorials/${set}/${toCamelCase(id)}`;

    keep.add(file);
    if (writeIfChanged(file, tutorialPage({ pkg: '2d', id, title, description, content }))) written++;
  }
  const deleted = prune(dir, keep);

  console.log(
    `Generated ${docs}/tutorials (${tutorials.length}, ${written} written, ${deleted} deleted) from src/tutorials/${set}`,
  );
}
