import { X } from 'lucide-react';
import styles from '../examples.module.css';
import ItemList from './ItemList';
import SearchInput from './SearchInput';
import ToggleSwitch from './ToggleSwitch';

import type React from 'react';
import type { Item } from '../types';

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showGifs: boolean;
  onGifToggle: (value: boolean) => void;
  compactView: boolean;
  onCompactToggle: (value: boolean) => void;
  isOpen: boolean;
  onToggle: () => void;
  filteredItems: Item[];
  onSelectExample: (item: Item) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    searchTerm,
    onSearchChange,
    showGifs,
    onGifToggle,
    compactView,
    onCompactToggle,
    isOpen,
    onToggle,
    filteredItems,
    onSelectExample,
}) => (
    <aside className={`${styles.sidebar} ${isOpen ? `${styles['sidebar--open']}` : ''}`}>
        <div className={`${styles.sidebar__header}`}>
            <div className={`${styles.sidebar__brand}`}>
                <h1 className={`${styles.sidebar__title}`}>Examples</h1>
            </div>
            <button className={`${styles.sidebar__close}`} onClick={onToggle} aria-label="Close sidebar">
                <X size={20} />
            </button>
        </div>

        <div className={`${styles.sidebar__content}`}>
            <div className={`${styles.sidebar__search}`}>
                <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Search examples..." />
            </div>

            <div className={`${styles.sidebar__controls}`}>
                <ToggleSwitch checked={showGifs} onChange={onGifToggle} label="PREVIEW" />
                <ToggleSwitch checked={compactView} onChange={onCompactToggle} label="Compact" />
            </div>

            <div className={`${styles.sidebar__list} .thin-scrollbar`}>
                <ItemList
                    items={filteredItems}
                    searchTerm={searchTerm}
                    showGifs={showGifs}
                    compactView={compactView}
                    onSelectExample={onSelectExample}
                />
            </div>
        </div>
    </aside>
);

export default Sidebar;
