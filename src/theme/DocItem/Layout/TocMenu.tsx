import { useDoc } from '@docusaurus/plugin-content-docs/client';
import TOCItems from '@theme/TOCItems';
import { useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import styles from './styles.module.scss';

/**
 * "On this page" below 1280 px: a menu beside the eyebrow that drops over the page. `<details>` opens before
 * hydration; once open, a link, Esc or a click elsewhere closes it.
 */
export default function TocMenu() {
  const { toc, frontMatter } = useDoc();
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = menu.current;

    if (!open || !el) return undefined;
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;

      if (!el.contains(target) || target.closest('a')) el.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      el.open = false;
      el.querySelector('summary')?.focus();
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <details ref={menu} className={styles.tocMenu} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>
        On this page
        <Icon name="chevron-down" size={14} strokeWidth={2} />
      </summary>
      <div className={styles.tocPanel}>
        <TOCItems
          toc={toc}
          minHeadingLevel={frontMatter.toc_min_heading_level}
          maxHeadingLevel={frontMatter.toc_max_heading_level}
          className="table-of-contents"
          linkClassName="toc-menu__link"
          linkActiveClassName="toc-menu__link--active"
        />
      </div>
    </details>
  );
}
