import styles from '../examples.module.css';
import ItemCard from './ItemCard';

import type React from 'react';
import type { Item } from '../types';

interface ItemListProps {
  items: Item[];
  searchTerm: string;
  showGifs: boolean;
  compactView: boolean;
  onSelectExample?: (item: Item) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, searchTerm, showGifs, compactView, onSelectExample }) => {
  if (items.length === 0) {
    return (
      <div className={`${styles['item-list__empty']}`}>
        <p>No examples found</p>
        {searchTerm && <p className={`${styles['item-list__empty-subtitle']}`}>Try adjusting your search terms</p>}
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item.name}
          item={item}
          searchTerm={searchTerm}
          showGif={showGifs}
          compact={compactView}
          hideImages={compactView}
          onClick={() => onSelectExample && onSelectExample(item)}
        />
      ))}
    </div>
  );
};

export default ItemList;
