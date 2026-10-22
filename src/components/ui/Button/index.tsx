import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Icon from '../Icon';
import styles from './styles.module.scss';

import type { IconName } from '../Icon';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'outline-pink' | 'small' | 'github' | 'icon';

interface OwnProps {
  variant?: ButtonVariant;
  /** Trailing arrow that nudges up and right on hover */
  arrow?: boolean;
  /** Leading glyph; the only content of an `icon` button, which then needs an `aria-label` */
  icon?: IconName;
  /** Frosted backing for outline buttons that sit over the hero */
  glass?: boolean;
  className?: string;
  children?: ReactNode;
}

type LinkButtonProps = OwnProps & { to: string } & Omit<ComponentPropsWithRef<'a'>, keyof OwnProps | 'href'>;
type NativeButtonProps = OwnProps & { to?: undefined } & Omit<ComponentPropsWithRef<'button'>, keyof OwnProps>;

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: styles.primary,
  outline: styles.outline,
  'outline-pink': styles.outlinePink,
  small: styles.small,
  github: styles.github,
  icon: styles.icon,
};

/**
 * Pill button. The outer element stays free for GSAP (`useMagnetic` moves it); every CSS hover and press transform
 * lives on the inner body, and `data-magnetic-label` marks the label that follows the pointer a little further.
 */
export default function Button(props: ButtonProps) {
  const { variant = 'primary', arrow, icon, glass, className, children, ...rest } = props;
  const classes = clsx(styles.button, VARIANT_CLASS[variant], glass && styles.glass, className);
  const body = (
    <span className={styles.body}>
      {icon && <Icon name={icon} size={variant === 'icon' ? 20 : 18} className={styles.glyph} />}
      {children !== undefined && (
        <span className={styles.label} data-magnetic-label="">
          {children}
        </span>
      )}
      {arrow && <Icon name="arrow-right" size={14} strokeWidth={2} className={styles.arrow} />}
    </span>
  );

  if (rest.to !== undefined) {
    return (
      <Link className={classes} {...(rest as LinkButtonProps)}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as NativeButtonProps)}>
      {body}
    </button>
  );
}

interface ButtonRowProps {
  align?: 'center' | 'start';
  className?: string;
  children: ReactNode;
}

/** Lays CTAs out in a wrapping row that stacks full width (max 340 px) on phones */
export function ButtonRow({ align = 'center', className, children }: ButtonRowProps) {
  return <div className={clsx(styles.row, align === 'start' && styles.rowStart, className)}>{children}</div>;
}
