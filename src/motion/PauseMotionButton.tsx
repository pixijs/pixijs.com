import clsx from 'clsx';
import Icon from '../components/ui/Icon';
import styles from './PauseMotionButton.module.scss';
import { usePauseMotion } from './usePauseMotion';

interface PauseMotionButtonProps {
  /** A frosted chip, for a control that sits on a moving backdrop */
  glass?: boolean;
  className?: string;
}

/** The hero's "Pause motion" text button (section 7.3, rule 9); hidden under reduced motion, where nothing moves */
export default function PauseMotionButton({ glass, className }: PauseMotionButtonProps) {
  const [paused, toggle] = usePauseMotion();

  return (
    <button type="button" className={clsx(styles.button, glass && styles.glass, className)} onClick={toggle}>
      <Icon name={paused ? 'play' : 'pause'} size={12} strokeWidth={2} />
      {paused ? 'Play motion' : 'Pause motion'}
    </button>
  );
}
