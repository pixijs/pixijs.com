import Link from '@docusaurus/Link';
import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

import type { CSSProperties, PointerEvent, ReactNode } from 'react';

export type CardCorner = 'tl' | 'tr' | 'br' | 'bl';

interface Shared {
  className?: string;
  style?: CSSProperties;
  /** Pins the hover or focus look, for the styleguide's state matrix */
  'data-state'?: 'hover' | 'focus';
  children?: ReactNode;
}

interface BaseCardProps extends Shared {
  variant?: 'base';
  as?: 'div' | 'article' | 'section' | 'li';
}

interface LinkCardProps extends Shared {
  variant: 'link';
  to: string;
  /** Image or preview, inset 8 px inside the card */
  media?: ReactNode;
  /** Offset-shadow colour on hover; defaults to pink */
  accent?: string;
}

interface ClosingCardProps extends Shared {
  variant: 'closing';
  /** Clay shapes centred on the card's corners */
  corners?: Partial<Record<CardCorner, ReactNode>>;
}

export type CardProps = BaseCardProps | LinkCardProps | ClosingCardProps;

/** Moves the hover glow to the pointer, at most once a frame */
export function usePointerGlow() {
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return useCallback((event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const { clientX, clientY } = event;

    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();

      el.style.setProperty('--mx', `${clientX - rect.left}px`);
      el.style.setProperty('--my', `${clientY - rect.top}px`);
    });
  }, []);
}

export default function Card(props: CardProps) {
  const onPointerMove = usePointerGlow();

  if (props.variant === 'link') {
    const { to, media, accent, className, style, children, 'data-state': state } = props;

    return (
      <Link
        to={to}
        className={clsx(styles.card, styles.link, className)}
        style={accent ? ({ ...style, '--accent': accent } as CSSProperties) : style}
        onPointerMove={onPointerMove}
        data-state={state}
      >
        {media && <div className={styles.media}>{media}</div>}
        <div className={styles.body}>{children}</div>
      </Link>
    );
  }

  if (props.variant === 'closing') {
    const { corners = {}, className, style, children } = props;

    return (
      <div className={clsx(styles.card, styles.closing, className)} style={style}>
        {children}
        {Object.entries(corners).map(([corner, node]) => (
          <span key={corner} className={clsx(styles.corner, styles[corner])} aria-hidden="true">
            {node}
          </span>
        ))}
      </div>
    );
  }

  const { as: Root = 'div', className, style, children } = props;

  return (
    <Root className={clsx(styles.card, styles.base, className)} style={style}>
      {children}
    </Root>
  );
}
