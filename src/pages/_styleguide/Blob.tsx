import ClayShape from '@site/src/components/ui/Clay';

import type { ClayShapeName, ClayShapeProps } from '@site/src/components/ui/Clay';

interface BlobProps extends Omit<ClayShapeProps, 'shape' | 'size'> {
  /** Any rendered shape name; the demos build some from tint lists */
  shape: string;
  size: number;
}

/** The styleguide's clay: a `ClayShape`, sized by `--k` where a section scales its shapes down */
export default function Blob({ shape, size, ...rest }: BlobProps) {
  return <ClayShape shape={shape as ClayShapeName} size={`calc(${size}px * var(--k, 1))`} {...rest} />;
}
