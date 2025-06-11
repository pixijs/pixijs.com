import Fuse from 'fuse.js';
import { examples } from '../config';

import type React from 'react';
import type { Item } from '../types';

const fuse = new Fuse<Item>(examples as Item[], {
  keys: [
    'name',
    'description',
    {
      name: 'dependencies',
      // Convert dependencies object to searchable string
      getFn: (item) => Object.keys(item.dependencies || {}).join(' '),
    },
  ],
  threshold: 0.4, // Lower threshold for more strict matching
  includeScore: true,
  findAllMatches: true,
  shouldSort: true,
  minMatchCharLength: 2,
});

export function filterItems(items: Item[], searchTerm: string): Item[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const lowercaseSearch = searchTerm.toLowerCase();

  // Use Fuse.js for fuzzy search
  fuse.setCollection(items);
  const fuseResults = fuse.search(lowercaseSearch);

  if (fuseResults.length > 0) {
    return fuseResults.map((result) => result.item);
  }

  // Enhanced fallback search
  return items.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(lowercaseSearch);
    const descMatch = item.description.toLowerCase().includes(lowercaseSearch);
    const depsMatch = Object.keys(item.dependencies || {}).some((dep) => dep.toLowerCase().includes(lowercaseSearch));

    return nameMatch || descMatch || depsMatch;
  });
}

export function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
