import { useRef } from 'react';
import Button from '@site/src/components/ui/Button';
import { useMagnetic } from '@site/src/motion/useMagnetic';

import type { ButtonProps } from '@site/src/components/ui/Button';

type MagneticButtonProps = ButtonProps & {
  to: string;
  /** Place in the hero's button row (0 or 1): the offset shadow slides out as the page opens (M1) */
  intro?: 0 | 1;
};

/** A link `Button` that leans toward a fine pointer (M8); for the hero and closing CTAs */
export default function MagneticButton({ intro, ...props }: MagneticButtonProps) {
  const button = useRef<HTMLAnchorElement>(null);

  useMagnetic(button);

  return <Button ref={button} data-intro={intro} {...props} />;
}
