import Link from '@docusaurus/Link';
import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import clsx from 'clsx';
import { useRef } from 'react';
import Icon from '../Icon';
import styles from './styles.module.scss';

import type { IconName } from '../Icon';
import type { KeyboardEvent, ReactNode } from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: IconName;
  /** Destination when the control renders as links */
  to?: string;
}

interface CommonProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  /** Accessible name of the group */
  label: string;
  /** `sm` (36 px) is the tinted rail style for the theme toggle; `xs` (32 px) the rail's section tabs */
  size?: 'md' | 'sm' | 'xs';
  /** Stretch to the container's width */
  fill?: boolean;
  className?: string;
}

interface RadioProps<T extends string> extends CommonProps<T> {
  as?: 'radio';
  onChange: (value: T) => void;
}

interface LinksProps<T extends string> extends CommonProps<T> {
  as: 'links';
}

export type SegmentedControlProps<T extends string> = RadioProps<T> | LinksProps<T>;

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * Pill track with a sliding thumb. Until the thumb is measured (and without JS) the selected segment paints the
 * thumb colour itself, so server and client render the same markup.
 */
export default function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const { options, value, label, size = 'md', fill, className } = props;
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = track.current;

    if (!el) return undefined;
    const place = () => {
      const current = el.querySelector<HTMLElement>('[data-selected]');

      if (!current) return;
      const outer = el.getBoundingClientRect();
      const inner = current.getBoundingClientRect();

      el.style.setProperty('--x', `${inner.left - outer.left - el.clientLeft}px`);
      el.style.setProperty('--w', `${inner.width}px`);
      if (el.dataset.ready === undefined) {
        el.dataset.ready = '';
        requestAnimationFrame(() => (el.dataset.animate = ''));
      }
    };
    const observer = new ResizeObserver(place);

    place();
    observer.observe(el);
    void document.fonts?.ready.then(place);

    return () => observer.disconnect();
  }, [value, options]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (props.as === 'links') return;
    const index = options.findIndex((option) => option.value === value);
    const last = options.length - 1;
    let next: number | undefined;

    if (event.key in KEY_STEP) next = (index + KEY_STEP[event.key] + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === undefined) return;
    event.preventDefault();
    props.onChange(options[next].value);
    track.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  const segment = (option: SegmentOption<T>) => {
    const selected = option.value === value;
    const content = (
      <>
        {option.icon && <Icon name={option.icon} size={size === 'md' ? 16 : 14} />}
        <span>{option.label}</span>
      </>
    );
    const shared = { className: styles.segment, 'data-selected': selected ? '' : undefined };

    if (props.as === 'links') {
      return (
        <Link key={option.value} to={option.to ?? '#'} aria-current={selected ? 'page' : undefined} {...shared}>
          {content}
        </Link>
      );
    }

    return (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={selected}
        tabIndex={selected ? 0 : -1}
        onClick={() => props.onChange(option.value)}
        {...shared}
      >
        {content}
      </button>
    );
  };

  return (
    <div
      ref={track}
      className={clsx(styles.track, styles[size], fill && styles.fill, className)}
      role={props.as === 'links' ? 'group' : 'radiogroup'}
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {options.map(segment)}
    </div>
  );
}
