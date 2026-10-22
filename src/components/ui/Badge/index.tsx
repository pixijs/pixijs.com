import clsx from 'clsx';
import styles from './styles.module.scss';

import type { ReactNode } from 'react';

interface BadgeProps {
  className?: string;
  children: ReactNode;
}

/** Pink label for what's new: "NEW" in the rail, "+ GLTF" on a feature. GSAP sweeps its shine through `--shine` */
export default function Badge({ className, children }: BadgeProps) {
  return <span className={clsx(styles.badge, className)}>{children}</span>;
}
