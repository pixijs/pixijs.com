import type React from 'react';
import type { Item } from '../types';

export function filterItems(items: Item[], searchTerm: string): Item[]
{
    if (!searchTerm.trim())
    {
        return items;
    }

    const lowercaseSearch = searchTerm.toLowerCase();

    return items.filter(
        (item) =>
            item.name.toLowerCase().includes(lowercaseSearch)
      || JSON.stringify(item.dependencies).toLowerCase().includes(lowercaseSearch),
    );
}

export function highlightText(text: string, searchTerm: string): React.ReactNode
{
    if (!searchTerm.trim())
    {
        return text;
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        (regex.test(part) ? (
            <mark key={index} className="highlight">
                {part}
            </mark>
        ) : (
            part
        )),
    );
}
