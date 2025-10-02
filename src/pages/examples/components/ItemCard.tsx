import { useEffect, useRef, useState } from 'react';
import styles from '../examples.module.css';
import { highlightText } from '../utils/searchUtils';

import type React from 'react';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
  searchTerm: string;
  showGif: boolean;
  compact?: boolean;
  hideImages?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  searchTerm,
  showGif,
  compact = false,
  hideImages = false,
  onClick,
  isSelected = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>(null);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleGifError = () => {
    setGifError(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Reset GIF error state when hovering again
    setGifError(false);

    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Show tooltip after a short delay
    tooltipTimeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();

        setTooltipPosition({
          x: rect.right + 16,
          y: rect.top,
        });
        setTooltipVisible(true);
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // Clear timeout and hide tooltip
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltipVisible(false);
  };

  // Clean up timeout on unmount
  useEffect(
    () => () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    },
    [],
  );

  // Show GIF only when hovering, GIF toggle is enabled, and GIF hasn't failed
  const shouldShowGif = showGif && isHovered && !gifError;
  const url = `/examples/previews/${item.name}`;
  const imageUrl = shouldShowGif ? `${url}.webp` : `${url}_thumbnail.webp`;
  const titleParts = item.name.split('_');
  const category = titleParts.shift()!.replaceAll('-', ' ');
  const title = titleParts.map((part) => part.charAt(0).toUpperCase() + part.replaceAll('-', ' ').slice(1)).join(' / ');

  return (
    <div
      ref={cardRef}
      className={`${styles['item-card']} ${compact ? styles['item-card--compact'] : ''} ${hideImages ? styles['item-card--no-image'] : ''} ${isSelected ? styles['item-card--selected'] : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {!hideImages && (
        <div className={styles['item-card__image-container']}>
          {imageLoading && (
            <div className={styles['item-card__skeleton']}>
              <div className={styles['skeleton-pulse']}></div>
            </div>
          )}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={item.name}
              className={`${styles['item-card__image']} ${imageLoading ? styles['item-card__image--loading'] : ''}`}
              onLoad={handleImageLoad}
              onError={shouldShowGif ? handleGifError : handleImageError}
              loading="lazy"
            />
          ) : (
            <div className={styles['item-card__placeholder']}>
              <span>No image</span>
            </div>
          )}
          {shouldShowGif && <div className={styles['item-card__gif-indicator']}>PREVIEW</div>}
        </div>
      )}
      <div className={styles['item-card__content']}>
        <h3 className={styles['item-card__category']}>{category}: </h3>
        <h3 className={styles['item-card__title']}>{highlightText(title, searchTerm)}</h3>
      </div>
      {/* Tooltip */}
      {tooltipVisible && (
        <div
          className={styles['item-card__tooltip']}
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)',
            zIndex: 9999,
          }}
        >
          <div className={styles['item-card__tooltip-content']}>
            <h4 className={styles['item-card__tooltip-title']}>{title}</h4>
            <div className={`${styles['item-card__tooltip-description']} .thin-scrollbar`}>{item.description}</div>
            <span className={styles['item-card__tooltip-category']}>{category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
