import { useCallback, useEffect, useState } from 'react';
import { isMotionPaused, onMotionPause, setMotionPaused } from './pause';

/** State and toggle for the global Pause motion control; `paused` is false during SSR and the first client render */
export function usePauseMotion(): [paused: boolean, toggle: () => void] {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPaused(isMotionPaused());

    return onMotionPause(setPaused);
  }, []);

  return [paused, useCallback(() => setMotionPaused(!isMotionPaused()), [])];
}
