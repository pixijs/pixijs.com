import React, { useEffect, useState } from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import examples from '../../data/examples.json';
import styles from './examples.module.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { filterItems } from './utils/searchUtils';
import { useHistory, useLocation } from '@docusaurus/router';

import type { Item } from './types';

export default function Examples(): React.JSX.Element {
  const location = useLocation();
  const history = useHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [showGifs, setShowGifs] = useLocalStorage('showGifs', false);
  const [compactView, setCompactView] = useLocalStorage('compactView', false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Item[]>(examples as Item[]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Read example from URL on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const exampleName = params.get('example');

    if (exampleName) {
      const found = examples.find((item) => item.name === exampleName) as Item | undefined;

      setSelectedItem(found || null);
    } else {
      setSelectedItem(null);
    }
  }, [location]);

  useEffect(() => {
    const filtered = filterItems(examples as Item[], searchTerm);

    setFilteredItems(filtered);
  }, [searchTerm]);

  useEffect(() => {
    // Store original styles for cleanup
    const elementsWithOriginalStyles = new Map<HTMLElement, { classes: string[]; padding: string; maxWidth: string }>();

    // Hack to remove padding from docusaurus container
    document.querySelectorAll('.main [class*="padding-top"], [class*="padding-bottom"]').forEach((element) => {
      // Store original classes and styles
      const originalClasses = Array.from(element.classList);
      const originalPadding = (element as HTMLDivElement).style.padding;
      const originalMaxWidth = (element as HTMLDivElement).style.maxWidth;

      elementsWithOriginalStyles.set(element as HTMLElement, {
        classes: originalClasses,
        padding: originalPadding,
        maxWidth: originalMaxWidth,
      });

      element.classList.remove('padding-top--md', 'padding-top--lg', 'padding-bottom--md', 'padding-bottom--lg');
      (element as HTMLDivElement).style.setProperty('padding', '0px', 'important');
      (element as HTMLDivElement).style.setProperty('max-width', '100%', 'important');
    });

    const paginationElements = document.querySelectorAll('[class*="pagination-nav"]');
    const originalPaginationDisplay = new Map();

    paginationElements.forEach((el) => {
      originalPaginationDisplay.set(el, (el as HTMLDivElement).style.display);
      (el as HTMLDivElement).style.display = 'none';
    });

    // Cleanup function
    return () => {
      // Restore original styles
      elementsWithOriginalStyles.forEach((original, element) => {
        // Restore classes
        element.className = '';
        original.classes.forEach((cls) => element.classList.add(cls));

        // Restore styles
        (element as HTMLDivElement).style.padding = original.padding;
        (element as HTMLDivElement).style.maxWidth = original.maxWidth;
      });

      // Restore pagination display
      originalPaginationDisplay.forEach((originalDisplay, el) => {
        (el as HTMLDivElement).style.display = originalDisplay;
      });
    };
  }, []);

  const handleSelectExample = (item: Item) => {
    // dont set selected item if already selected
    if (selectedItem && selectedItem.name === item.name) {
      return;
    }
    setSelectedItem(item);
    const params = new URLSearchParams(location.search);

    params.set('example', item.name);
    history.push({ search: params.toString() });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleGifToggle = (value: boolean) => {
    setShowGifs(value);
  };

  const handleCompactToggle = (value: boolean) => {
    setCompactView(value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className={styles.app}>
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showGifs={showGifs}
          onGifToggle={handleGifToggle}
          compactView={compactView}
          onCompactToggle={handleCompactToggle}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          filteredItems={filteredItems}
          onSelectExample={handleSelectExample}
          selectedItem={selectedItem}
        />
        <MainContent selectedItem={selectedItem} />
        {sidebarOpen && <div className={`${styles.overlay}`} onClick={toggleSidebar} />}
      </div>
    </>
  );
}
