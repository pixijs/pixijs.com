import clsx from 'clsx';
import styles from './classes';
import Icon from '@site/src/components/ui/Icon';

import type { RefObject } from 'react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** How many examples there are to search, for the placeholder */
  count: number;
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
}

export default function SearchField({ value, onChange, count, inputRef, className }: SearchFieldProps) {
  return (
    <label className={clsx(styles.search, className)}>
      <Icon name="search" size={16} className={styles.searchIcon} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={`Search ${count} examples`}
        aria-label="Search examples"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        data-verify="example-search"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.stopPropagation();
            onChange('');
          }
        }}
      />
      {value && (
        <button type="button" className={styles.searchClear} aria-label="Clear search" onClick={() => onChange('')}>
          <Icon name="x" size={14} />
        </button>
      )}
    </label>
  );
}
