import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '../../../pages/examples/examples.module.css';
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
  expandAll?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  searchTerm,
  showGifs,
  compactView,
  onSelectExample,
  selectedItem,
  expandAll,
}) => {
  const selectedCardRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const hasScrolledRef = useRef(false);

  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      const category = item.name.split('_')[0].replaceAll('-', ' ');
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, Item[]>,
  );

  const categories = Object.keys(itemsByCategory).sort();

  // Initialize expanded categories based on selected item or expand all
  useEffect(() => {
    if (selectedItem) {
      const selectedCategory = selectedItem.name.split('_')[0].replaceAll('-', ' ');
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        newSet.add(selectedCategory);
        return newSet;
      });
      // Reset scroll flag when selected item changes to allow scrolling to new selection
      hasScrolledRef.current = false;
    }
  }, [selectedItem]);

  // Handle expand all toggle
  useEffect(() => {
    if (expandAll !== undefined) {
      if (expandAll) {
        setExpandedCategories(new Set(categories));
      } else {
        // Keep selected category expanded
        if (selectedItem) {
          const selectedCategory = selectedItem.name.split('_')[0].replaceAll('-', ' ');
          setExpandedCategories(new Set([selectedCategory]));
        } else {
          setExpandedCategories(new Set());
        }
      }
    }
  }, [expandAll]);

  // Scroll to selected item when it changes
  useEffect(() => {
    if (selectedItem && !hasScrolledRef.current) {
      const selectedCategory = selectedItem.name.split('_')[0].replaceAll('-', ' ');
      const isCategoryExpanded = expandedCategories.has(selectedCategory);

      // Only scroll if the category is expanded and we haven't scrolled yet
      if (isCategoryExpanded) {
        // Delay to ensure DOM is updated after expansion
        const timeoutId = setTimeout(() => {
          const element = selectedCardRef.current[selectedItem.name];
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            hasScrolledRef.current = true;
          }
        }, 150);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [selectedItem, expandedCategories]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category);
        const categoryItems = itemsByCategory[category];
        const categoryItemCount = categoryItems.length;

        return (
          <div key={category} className={styles['category-section']}>
            <button
              className={styles['category-header']}
              onClick={() => toggleCategory(category)}
              aria-expanded={isExpanded}
            >
              <ChevronDown
                size={16}
                className={`${styles['category-chevron']} ${isExpanded ? styles['category-chevron--expanded'] : ''}`}
              />
              <span className={styles['category-title']}>{category}</span>
              <span className={styles['category-count']}>({categoryItemCount})</span>
            </button>
            {isExpanded && (
              <div className={styles['category-items']}>
                {categoryItems.map((item) => {
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
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
