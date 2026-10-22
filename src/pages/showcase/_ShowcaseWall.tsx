import { useEffect, useRef } from 'react';
import { pageClasses } from '@site/src/components/Page/classes';
import { showcaseItems } from '@site/src/data/showcase';
import { motionAllowed, onMotionPause } from '@site/src/motion/pause';

import type { CSSProperties, RefObject } from 'react';

const styles = pageClasses('showcase');

const COLUMNS = 8;
/** Shots a column, for a column about 1.4 times the wall's height */
const LENGTH = 9;
/** How far along the projects each column starts from the last, so neighbouring columns never start alike */
const STEP = Math.floor(showcaseItems.length / COLUMNS) + 3;
const WALL = Array.from({ length: COLUMNS }, (_, column) =>
  Array.from({ length: LENGTH }, (_, row) => showcaseItems[(column * STEP + row) % showcaseItems.length]),
);

/**
 * Lights a shot on screen now and then while the wall is in view, and pauses the columns' drift while it isn't.
 * With motion paused or reduced, a few shots stay lit instead.
 */
function useHighlight(stage: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = stage.current;

    if (!root) return undefined;
    const shots = Array.from(root.querySelectorAll<HTMLElement>('figure'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();
    /** Shots on screen, short of the viewport's bottom 15% */
    const visible = new Set<Element>();
    let interval = 0;
    let inView = false;

    const tick = () => {
      const pool = [...visible].filter((shot) => !shot.hasAttribute('data-lit'));
      const shot = pool[Math.floor(Math.random() * pool.length)];

      if (!shot) return;
      shot.toggleAttribute('data-lit', true);
      const timer = window.setTimeout(() => {
        shot.toggleAttribute('data-lit', false);
        timers.delete(timer);
      }, 2600);

      timers.add(timer);
    };
    const update = () => {
      const still = !motionAllowed();

      clearInterval(interval);
      timers.forEach(clearTimeout);
      timers.clear();
      shots.forEach((shot, index) => shot.toggleAttribute('data-lit', still && index % 7 === 3));
      root.toggleAttribute('data-offscreen', !inView);
      if (!still && inView) interval = window.setInterval(tick, 650);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    const shotObserver = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) visible.add(target);
          else visible.delete(target);
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    const offPause = onMotionPause(update);

    observer.observe(root);
    shots.forEach((shot) => shotObserver.observe(shot));
    reduced.addEventListener('change', update);

    return () => {
      observer.disconnect();
      shotObserver.disconnect();
      offPause();
      reduced.removeEventListener('change', update);
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [stage]);
}

/**
 * The header's backdrop: the projects' shots, tilted into a wall drifting in columns behind the copy, which fades
 * into the tile where the title sits
 */
export default function ShowcaseWall() {
  const stage = useRef<HTMLDivElement>(null);

  useHighlight(stage);

  return (
    <div ref={stage} className={styles.stage} aria-hidden="true">
      <div className={styles.wall}>
        {WALL.map((items, column) => (
          <div key={column} className={styles.column} style={{ '--c': column } as CSSProperties}>
            <div className={styles.track}>
              {items.map((item, row) => (
                <figure key={row} className={styles.shot}>
                  <img src={item.imageUrl} alt="" width={720} height={405} loading="lazy" decoding="async" />
                  <figcaption>
                    <b>{item.title}</b>
                    {item.author}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
