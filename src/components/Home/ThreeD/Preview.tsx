import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import ClayShape from '@site/src/components/ui/Clay';
import styles from './styles';

import type { ClayShapeName } from '@site/src/components/ui/Clay';

interface PreviewProps {
  /** A 3D example's name; its still is `/examples/previews/3d/<name>_thumbnail.webp` */
  name: string;
  /** Stands in when the still hasn't been captured yet */
  shape: ClayShapeName;
  /** Also load the example's short animated preview and show it over the still */
  playing?: boolean;
  className?: string;
}

/** A 3D example's preview still (600×338), with a clay shape in its place until the capture exists */
export default function Preview({ name, shape, playing, className }: PreviewProps) {
  const base = useBaseUrl(`/examples/previews/3d/${name}`);
  const still = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);
  const [stuck, setStuck] = useState(false);

  // A still that failed before hydration never reaches onError
  useEffect(() => {
    if (still.current?.complete && still.current.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <span className={clsx(styles.preview, className)} data-missing={missing || undefined}>
      {missing ? (
        <ClayShape shape={shape} className={styles.previewShape} />
      ) : (
        <img
          ref={still}
          src={`${base}_thumbnail.webp`}
          width={600}
          height={338}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
        />
      )}
      {playing && !missing && !stuck && (
        <img
          className={styles.previewMotion}
          src={`${base}.webp`}
          width={320}
          height={180}
          alt=""
          onError={() => setStuck(true)}
        />
      )}
    </span>
  );
}
