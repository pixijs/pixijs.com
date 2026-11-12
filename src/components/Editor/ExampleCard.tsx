import styles from './PixiExample.module.scss';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import { usePackages } from '@site/src/shell/package';

import type { PackageDef } from '@site/src/data/packages';
import type { CSSProperties, ReactNode } from 'react';

export interface ExampleCardProps {
  name: string;
  pkg: '2d' | '3d';
  /** Preview height */
  height?: number | string;
  width?: number | string;
  codeShown?: boolean;
  /** Preview image, for examples that have one (hidden examples don't) */
  poster?: string;
  /** Without it the code toggle waits for the live example */
  onToggleCode?: () => void;
  /** The live example; the poster stands in until then */
  children?: ReactNode;
}

/** The playground opened on the example `name` of package `def` */
export const playgroundHref = (def: PackageDef, name: string) =>
  `${def.versions.current.playground}?example=${encodeURIComponent(name)}`;

/** The poster, and the code panel's space when the code is shown, until the live example replaces them */
export function ExamplePlaceholder({ codeShown }: { codeShown?: boolean }) {
  return (
    <>
      <div className={styles.poster} />
      {codeShown && <div className={styles.codeSlot} />}
    </>
  );
}

/**
 * The frame of a `<PixiExample>`: the example's name, a code toggle and a playground link over the preview. It renders
 * on the server at its final size, so the live example replaces it without moving the page.
 */
export default function ExampleCard({
  name,
  pkg,
  height = 400,
  width,
  codeShown,
  poster,
  onToggleCode,
  children,
}: ExampleCardProps) {
  const playground = playgroundHref(usePackages()[pkg], name);
  const style = {
    maxWidth: width,
    '--example-h': typeof height === 'number' ? `${height}px` : height,
    ...(poster && { '--example-poster': `url(${poster})`, '--example-poster-size': 'cover' }),
  } as CSSProperties;

  return (
    <figure className={styles.example} data-package={pkg} style={style}>
      <figcaption className={styles.head}>
        <span className={styles.name}>{name.replaceAll('_', ' · ').replaceAll('-', ' ')}</span>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={codeShown ?? false}
          disabled={!onToggleCode}
          onClick={onToggleCode}
        >
          <Icon name="code" size={16} />
          <span className={styles.label}>Code</span>
        </button>
        <Button variant="small" to={playground} className={styles.open} aria-label="Open in playground">
          <span className={styles.label}>Playground</span>
          <Icon name="external" size={14} />
        </Button>
      </figcaption>
      {children ?? <ExamplePlaceholder codeShown={codeShown} />}
    </figure>
  );
}
