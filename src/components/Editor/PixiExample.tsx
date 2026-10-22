import { type RefObject, useEffect, useRef, useState } from 'react';
import ExampleCard, { ExamplePlaceholder } from './ExampleCard';
import LazyEditor from './LazyEditor';
import styles from './PixiExample.module.scss';
import { getExample, posterOf, useExampleFiles } from '@site/src/components/Examples/data';

import type { EditorProps } from './Editor';
import type { SourceFiles } from '@site/src/runtime/compile';

export type PixiExampleProps = { name: string; pkg?: '2d' | '3d' } & Omit<
  EditorProps,
  'files' | 'dependencies' | 'pkg'
>;

/**
 * Whether the element is close enough to run: true from 200 px before it scrolls into view, false again once it's more
 * than two screens away, which keeps a page's live WebGL contexts few
 */
function useNearViewport(ref: RefObject<HTMLElement | null>): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return undefined;
    const enter = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), {
      rootMargin: '200px 0px',
    });
    const leave = new IntersectionObserver(([entry]) => !entry.isIntersecting && setNear(false), {
      rootMargin: '200% 0px',
    });

    enter.observe(el);
    leave.observe(el);

    return () => {
      enter.disconnect();
      leave.disconnect();
    };
  }, [ref]);

  return near;
}

/** Embeds the example `name` of package `pkg` with all its files: the poster first, live once it's near the screen */
export default function PixiExample({
  name,
  pkg = '2d',
  viewType = 'preview',
  height = 400,
  width,
  ...props
}: PixiExampleProps) {
  const example = getExample(name, pkg);
  const [codeShown, setCodeShown] = useState(viewType !== 'preview');
  const [live, setLive] = useState<SourceFiles | null>(null);
  const edits = useRef<SourceFiles | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const near = useNearViewport(body);
  const { files, failure } = useExampleFiles(example, near);

  // Edits survive the editor unmounting far off screen: it remounts with them
  useEffect(() => setLive(near && files ? (edits.current ?? files) : null), [near, files]);

  const message = example ? failure : `There's no ${pkg.toUpperCase()} example called "${name}".`;
  const poster = example && posterOf(example);

  return (
    <ExampleCard
      name={name}
      pkg={pkg}
      height={height}
      width={width}
      codeShown={codeShown}
      poster={poster}
      onToggleCode={example ? () => setCodeShown(!codeShown) : undefined}
    >
      <div ref={body} className={styles.body}>
        {message ? (
          <p className={styles.failure}>{message}</p>
        ) : live ? (
          <LazyEditor
            layout="stack"
            {...props}
            files={live}
            dependencies={example?.dependencies}
            pkg={pkg}
            name={name}
            height={height}
            viewType={codeShown ? 'both' : 'preview'}
            poster={poster}
            onFilesChange={(next) => (edits.current = next)}
            className={styles.editor}
          />
        ) : (
          <ExamplePlaceholder codeShown={codeShown} />
        )}
      </div>
    </ExampleCard>
  );
}
