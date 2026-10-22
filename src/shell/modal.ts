/** Where the rail docks and sheets become popovers; keep in step with `$bp.lg` in src/css/_breakpoints.scss */
export const DOCKED_MEDIA = '(min-width: 997px)';

let locks = 0;

/** Stops the page scrolling behind a drawer or modal; the gutter stays, so nothing shifts. Returns the unlock */
export function lockScroll(): () => void {
  const root = document.documentElement;

  if (locks++ === 0) {
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
  }

  return () => {
    if (--locks === 0) {
      root.style.overflow = '';
      root.style.scrollbarGutter = '';
    }
  };
}

/** Makes everything outside `keep` inert (siblings of each ancestor up to `body`). Returns the undo */
export function inertOutside(keep: HTMLElement): () => void {
  const changed: HTMLElement[] = [];

  for (let node: HTMLElement | null = keep; node && node !== document.body; node = node.parentElement) {
    for (const sibling of Array.from(node.parentElement?.children ?? [])) {
      if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert && sibling.tagName !== 'SCRIPT') {
        sibling.inert = true;
        changed.push(sibling);
      }
    }
  }

  return () => changed.forEach((el) => (el.inert = false));
}
