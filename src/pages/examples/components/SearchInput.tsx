import { Search, X } from 'lucide-react';
import styles from '../examples.module.css';

import type React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search...' }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`${styles['search-input']}`}>
      <Search className={`${styles['search-input__icon']}`} size={18} />
      <input
        type="text"
        className={`${styles['search-input__field']}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button className={`${styles['search-input__clear']}`} onClick={handleClear} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
