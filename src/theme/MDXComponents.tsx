import { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useActivePluginAndVersion } from '@docusaurus/plugin-content-docs/client';
import ExampleCard from '@site/src/components/Editor/ExampleCard';
import MDXComponents from '@theme-original/MDXComponents';

import type { PixiExampleProps } from '@site/src/components/Editor/PixiExample';
import type { ComponentProps } from 'react';

const LazyPixiExample = lazy(() => import('@site/src/components/Editor/PixiExample'));

/**
 * `<PixiExample>` in MDX without an import. The server renders its frame with the poster; the example data and the
 * editor load in the browser, only on pages that have one. `pkg` defaults to the docs instance the page is in.
 */
function PixiExample(props: PixiExampleProps) {
  const pluginId = useActivePluginAndVersion()?.activePlugin.pluginId;
  const pkg = props.pkg ?? (pluginId === '3d' ? '3d' : '2d');
  const fallback = (
    <ExampleCard
      name={props.name}
      pkg={pkg}
      height={props.height}
      width={props.width}
      codeShown={(props.viewType ?? 'preview') !== 'preview'}
    />
  );

  return (
    <BrowserOnly fallback={fallback}>
      {() => (
        <Suspense fallback={fallback}>
          <LazyPixiExample {...props} pkg={pkg} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

/** Markdown tables scroll inside their frame on narrow screens; the frame takes focus so keyboards can scroll it */
function Table(props: ComponentProps<'table'>) {
  return (
    <div className="table-scroll" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

export default { ...MDXComponents, PixiExample, table: Table };
