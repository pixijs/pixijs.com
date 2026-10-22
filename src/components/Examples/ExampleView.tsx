import Link from '@docusaurus/Link';
import { PageMetadata } from '@docusaurus/theme-common';
import styles from './classes';
import { categoryLabel, categoryOf, posterOf, titleOf, useExampleFiles } from './data';
import { playgroundHref } from '@site/src/components/Editor/ExampleCard';
import LazyEditor from '@site/src/components/Editor/LazyEditor';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import { usePackages } from '@site/src/shell/package';

import type { Item } from './types';

interface ExampleViewProps {
  example: Item;
  /** The examples before and after this one in gallery order */
  previous?: Item;
  next?: Item;
  galleryPath: string;
  hrefOf: (item: Item) => string;
  /** Opens the example picker (below 1280 px, where there's no sidebar) */
  onBrowse: () => void;
}

/** The empty editor frame shown until the editor chunk and the example's files arrive */
export function EditorSkeleton({ poster }: { poster?: string }) {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <span className={styles.skeletonHead} />
      <span className={styles.skeletonCode}>
        {[62, 38, 0, 74, 55, 81, 0, 47, 66, 30].map((width, index) => (
          <span key={index} style={{ width: `${width}%` }} />
        ))}
      </span>
      <span className={styles.skeletonPreview} style={poster ? { backgroundImage: `url(${poster})` } : undefined} />
    </div>
  );
}

/** One example in the editor, under a header with its category, title, neighbours and a playground link */
export default function ExampleView({ example, previous, next, galleryPath, hrefOf, onBrowse }: ExampleViewProps) {
  const { files, failure } = useExampleFiles(example);
  const packages = usePackages();
  const category = categoryOf(example);
  const title = titleOf(example);
  const poster = posterOf(example);

  return (
    <div className={styles.view}>
      <PageMetadata title={`${title} · ${categoryLabel(category)} example`} description={example.description} />
      <header className={styles.viewHead}>
        <Link to={galleryPath} className={styles.back} aria-label="All examples">
          <Icon name="chevron-left" size={18} />
        </Link>
        <div className={styles.viewTitles}>
          <Link to={`${galleryPath}#${category}`} className={styles.eyebrow}>
            <span className={styles.dot} />
            {categoryLabel(category)}
          </Link>
          <div className={styles.viewTitleRow}>
            <h1 className={styles.viewTitle}>{title}</h1>
            <p className={styles.viewText}>{example.description}</p>
          </div>
        </div>
        <div className={styles.viewActions}>
          <button type="button" className={styles.browseButton} aria-label="Browse examples" onClick={onBrowse}>
            <Icon name="layout-grid" size={16} />
            <span>Browse</span>
          </button>
          <span className={styles.stepper}>
            {[
              { item: previous, label: 'Previous example', icon: 'chevron-left' as const },
              { item: next, label: 'Next example', icon: 'chevron-right' as const },
            ].map(({ item, label, icon }) =>
              item ? (
                <Link
                  key={label}
                  to={hrefOf(item)}
                  className={styles.iconButton}
                  aria-label={`${label}: ${titleOf(item)}`}
                  title={titleOf(item)}
                >
                  <Icon name={icon} size={18} />
                </Link>
              ) : (
                <span key={label} className={styles.iconButton} aria-hidden="true" data-disabled="">
                  <Icon name={icon} size={18} />
                </span>
              ),
            )}
          </span>
          <Button
            variant="small"
            to={playgroundHref(packages[example.pkg], example.name)}
            className={styles.open}
            aria-label="Open in playground"
          >
            <span className={styles.openLabel}>Open in playground</span>
            <Icon name="external" size={14} />
          </Button>
        </div>
      </header>
      <div className={styles.viewBody}>
        <EditorSkeleton poster={poster} />
        {failure ? (
          <p className={styles.failure}>
            <Icon name="circle-alert" size={18} />
            {failure}. Check your connection and reload the page.
          </p>
        ) : (
          files && (
            <LazyEditor
              key={example.name}
              files={files}
              dependencies={example.dependencies}
              pkg={example.pkg}
              name={example.name}
              poster={poster}
              resizable
              className={styles.editor}
            />
          )
        )}
      </div>
    </div>
  );
}
