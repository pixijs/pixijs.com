import clsx from 'clsx';
import { SPRITE } from './sprite';
import styles from './styles.module.scss';

import type { Glyph, IconName } from './sprite';

export type { IconName };
export const ICON_NAMES = Object.keys(SPRITE) as IconName[];

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Accessible name; without it the icon is decorative and hidden from assistive tech */
  label?: string;
  className?: string;
}

export default function Icon({ name, size = 16, strokeWidth = 1.75, label, className }: IconProps) {
  const glyph: Glyph = SPRITE[name];
  const { body, viewBox = '0 0 24 24', filled } = glyph;

  return (
    <svg
      className={clsx(styles.icon, className)}
      width={size}
      height={size}
      viewBox={viewBox}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {body}
    </svg>
  );
}
