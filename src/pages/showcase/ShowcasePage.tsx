import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ArrowUpRight, Image as ImageIcon, AlertCircle, Search, Plus } from 'lucide-react';
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import styles from './Showcase.module.css';
import { showcaseItems } from '../../data/showcase';

// TypeScript Interfaces
export interface ShowcaseItem {
  title: string;
  author: string;
  imageUrl: string;
  link: string;
  alt?: string;
  openSourceLink?: string;
  sponsoredLink?: string;
}

export interface ShowcaseProps {
  title: string;
  subtitle: string;
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
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add staggered delay for each panel
            setTimeout(() => {
              setIsVisible(true);
            }, animationDelay);
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation values (adjust multiplier for intensity)
    const rotateY = (mouseX / rect.width) * 8; // Max 20 degrees
    const rotateX = -(mouseY / rect.height) * 8; // Max 20 degrees, inverted
    const rotateZ = (mouseX / rect.width) * 1; // Subtle Z rotation

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale3d(1.02, 1.02, 1.02)`,
    );
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('');
  }, []);

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

  const handleBadgeClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, type: 'openSource' | 'sponsored') => {
      e.stopPropagation();
      window.open(type === 'openSource' ? item.openSourceLink : item.sponsoredLink, '_blank', 'noopener,noreferrer');
    },
    [item.openSourceLink, item.sponsoredLink],
  );

  return (
    <div
      ref={panelRef}
      className={`${styles.panel} ${isVisible ? styles.visible : styles.hidden} ${item.sponsoredLink ? styles.sponsored : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={item.link ? 0 : -1}
      role={item.link ? 'button' : 'article'}
      aria-label={item.link ? `View ${item.title}` : item.title}
      style={{
        transform: transform,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
      }}
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
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleContainer}>
            <h3 className={styles.panelTitle}>{item.title}</h3>
            <div className={styles.badges}>
              {item.sponsoredLink && (
                <span onClick={(e) => handleBadgeClick(e, 'sponsored')} className={styles.sponsoredBadge}>
                  Sponsored
                </span>
              )}
              {item.openSourceLink && (
                <span onClick={(e) => handleBadgeClick(e, 'openSource')} className={styles.openSourceBadge}>
                  Open Source
                </span>
              )}
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
const Showcase: React.FC<ShowcaseProps> = ({ title, subtitle, animationDelay = 100, className = '' }) => {
  const items = showcaseItems;
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

    const sponsored = items.filter((item) => item.sponsoredLink);
    const nonSponsored = items.filter((item) => !item.sponsoredLink);

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

  const handleSubmitProject = useCallback(() => {
    window.open('https://form.jotform.com/251755678972071', '_blank', 'noopener,noreferrer');
  }, []);

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
          <div className={styles.searchAndSubmit}>
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

            <button
              onClick={handleSubmitProject}
              className={styles.submitButton}
              aria-label="Submit your project to the showcase"
            >
              <Plus size={18} />
              Submit Project
            </button>
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
