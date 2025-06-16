import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ArrowUpRight, Image as ImageIcon, AlertCircle, Search } from 'lucide-react';
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import styles from './Showcase.module.css';

// TypeScript Interfaces
export interface ShowcaseItem {
  title: string;
  author: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  isSponsored?: boolean;
  isOpenSource?: boolean;
}

export interface ShowcaseProps {
  title: string;
  subtitle: string;
  items: ShowcaseItem[];
  animationDelay?: number;
  className?: string;
}

// Individual Panel Component
interface PanelProps {
  item: ShowcaseItem;
  index: number;
  animationDelay: number;
}

const Panel: React.FC<PanelProps> = ({ item, index, animationDelay }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add staggered delay for each panel
            setTimeout(() => {
              setIsVisible(true);
            }, index * animationDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    if (panelRef.current) {
      observer.observe(panelRef.current);
    }

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, [index, animationDelay]);

  const handleClick = useCallback(() => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }, [item.link]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div
      ref={panelRef}
      className={`${styles.panel} ${isVisible ? styles.visible : styles.hidden} ${item.isSponsored ? styles.sponsored : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={item.link ? 0 : -1}
      role={item.link ? 'button' : 'article'}
      aria-label={item.link ? `View ${item.title}` : item.title}
    >
      <div className={styles.panelContent}>
        <div className={styles.imageContainer}>
          {!imageLoaded && !imageError && (
            <div className={styles.loading}>
              <ImageIcon size={24} />
              <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
            </div>
          )}

          {imageError && (
            <div className={styles.error}>
              <AlertCircle size={24} />
              <span style={{ marginLeft: '0.5rem' }}>Failed to load image</span>
            </div>
          )}

          <img
            src={item.imageUrl}
            alt={item.alt || item.title}
            className={styles.image}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              display: imageLoaded && !imageError ? 'block' : 'none',
            }}
          />

          <div className={styles.overlay} />
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleContainer}>
            <h3 className={styles.panelTitle}>{item.title}</h3>
            <div className={styles.badges}>
              {item.isSponsored && <span className={styles.sponsoredBadge}>Sponsored</span>}
              {item.isOpenSource && <span className={styles.openSourceBadge}>Open Source</span>}
            </div>
          </div>
          <div className={styles.descriptionContainer}>
            <p className={styles.panelDescription}>{item.author}</p>
            {item.link && <ArrowUpRight className={styles.arrow} size={18} aria-hidden="true" />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Showcase Component
const Showcase: React.FC<ShowcaseProps> = ({ title, subtitle, items, animationDelay = 100, className = '' }) => {
  const showcaseRef = useRef<HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Randomize items with priority for sponsored entries
  const randomizedItems = useMemo(() => {
    const shuffleArray = (array: ShowcaseItem[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const sponsored = items.filter((item) => item.isSponsored);
    const nonSponsored = items.filter((item) => !item.isSponsored);

    return [...shuffleArray(sponsored), ...shuffleArray(nonSponsored)];
  }, [items]);

  // Initialize Fuse instance
  const fuse = useMemo(() => {
    const options: IFuseOptions<ShowcaseItem> = {
      keys: ['title', 'description'],
      threshold: 0.3,
      includeScore: true,
      shouldSort: true,
    };

    return new Fuse(randomizedItems, options);
  }, [randomizedItems]);

  // Filter items using Fuse.js search
  const filteredItems = useMemo((): ShowcaseItem[] => {
    if (!searchTerm) {
      return randomizedItems;
    }

    return fuse.search(searchTerm).map(({ item }) => item);
  }, [fuse, searchTerm, randomizedItems]);

  return (
    <section ref={showcaseRef} className={`${styles.showcase} ${className}`} aria-labelledby="showcase-title">
      <div className={styles.container}>
        <header>
          <h2 id="showcase-title" className={styles.title}>
            {title}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>

        {/* Search and Filter Controls */}
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.grid} role="grid" aria-label="Showcase items">
          {filteredItems.map((item, index) => (
            <Panel key={index} item={item} index={index} animationDelay={animationDelay} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className={styles.noResults}>
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Showcase;
