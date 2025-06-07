import { useState } from 'react';
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
}

const ItemCard: React.FC<ItemCardProps> = ({ item, searchTerm, showGif, compact = false, hideImages = false, onClick }) =>
{
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [gifError, setGifError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleImageLoad = () =>
    {
        setImageLoading(false);
    };

    const handleImageError = () =>
    {
        setImageLoading(false);
        setImageError(true);
    };

    const handleGifError = () =>
    {
        setGifError(true);
    };

    const handleMouseEnter = () =>
    {
        setIsHovered(true);
        // Reset GIF error state when hovering again
        setGifError(false);
    };

    const handleMouseLeave = () =>
    {
        setIsHovered(false);
    };

    // Show GIF only when hovering, GIF toggle is enabled, and GIF hasn't failed
    const shouldShowGif = showGif && isHovered && !gifError;
    const url = `/examples/previews/${item.name}`;
    const imageUrl = shouldShowGif ? `${url}.gif` : `${url}.png`;
    const titleParts = item.name.split('_');
    const category = titleParts.shift();
    const title = titleParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' / ');

    return (
        <div
            className={`${styles['item-card']} ${compact ? styles['item-card--compact'] : ''} ${hideImages ? styles['item-card--no-image'] : ''}`}
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
                <h3 className={styles['item-card__category']}>{category}</h3>
                <h3 className={styles['item-card__title']}>{highlightText(title, searchTerm)}</h3>
            </div>
        </div>
    );
};

export default ItemCard;
