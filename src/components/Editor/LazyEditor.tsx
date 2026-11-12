import BrowserOnly from '@docusaurus/BrowserOnly';
import { lazy, Suspense } from 'react';

import type { EditorProps } from './Editor';

const Editor = lazy(() => import('./Editor'));

/**
 * The editor, fetched when it first renders in the browser. Pages that show one stay light, and a route prefetch
 * never pulls the editor chunk.
 */
export default function LazyEditor(props: EditorProps) {
  const fallback = <div style={{ width: props.width ?? '100%', height: props.height ?? '100%' }} />;

  return (
    <BrowserOnly fallback={fallback}>
      {() => (
        <Suspense fallback={fallback}>
          <Editor {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
