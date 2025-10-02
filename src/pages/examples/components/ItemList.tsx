import { useEffect, useRef } from 'react';
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
  selectedItem?: Item | null;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  searchTerm,
  showGifs,
  compactView,
  onSelectExample,
  selectedItem,
}) => {
  const selectedCardRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to selected item when it changes
  useEffect(() => {
    if (selectedItem && selectedCardRef.current[selectedItem.name]) {
      selectedCardRef.current[selectedItem.name]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedItem]);

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
      {items.map((item) => {
        const isSelected = selectedItem?.name === item.name;
        return (
          <div
            key={item.name}
            ref={(el) => {
              if (isSelected) {
                selectedCardRef.current[item.name] = el;
              }
            }}
          >
            <ItemCard
              item={item}
              searchTerm={searchTerm}
              showGif={showGifs}
              compact={compactView}
              hideImages={compactView}
              onClick={() => onSelectExample && onSelectExample(item)}
              isSelected={isSelected}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
