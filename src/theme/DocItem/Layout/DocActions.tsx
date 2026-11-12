import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import styles from './styles.module.scss';

/** Copies the page's markdown; Safari only allows the clipboard write if the fetch is handed over as a promise */
async function copyMarkdown(href: string) {
  const text = fetch(href).then((response) => (response.ok ? response.text() : Promise.reject(new Error(href))));

  if (typeof ClipboardItem === 'undefined') {
    await navigator.clipboard.writeText(await text);

    return;
  }
  const blob = text.then((markdown) => new Blob([markdown], { type: 'text/plain' }));

  await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
}

/** The TOC's footer: "Edit this page", and "Copy as Markdown" for the current guides, which build a `.md` copy */
export default function DocActions() {
  const { metadata } = useDoc();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const markdown =
    metadata.version === 'current' && metadata.permalink.includes('/guides/')
      ? `${metadata.permalink.replace(/\/$/, '')}.md`
      : null;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!metadata.editUrl && !markdown) return null;

  const copy = () =>
    copyMarkdown(markdown!).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1200);
      },
      () => window.open(markdown!, '_blank', 'noopener'),
    );

  return (
    <div className={styles.actions}>
      {metadata.editUrl && (
        <a href={metadata.editUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={15} />
          Edit this page
        </a>
      )}
      {markdown && (
        <button type="button" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} size={15} />
          {copied ? 'Copied' : 'Copy as Markdown'}
        </button>
      )}
    </div>
  );
}
