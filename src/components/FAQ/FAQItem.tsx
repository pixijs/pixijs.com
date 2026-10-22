import { Prose } from '@site/src/components/Page';
import styles from './FAQItem.module.scss';

import type { ReactNode } from 'react';

export interface FAQItemProps {
  question: string;
  children: ReactNode;
}

/**
 * One question as a native disclosure: it works without JS, and find-in-page opens the answer it finds. The answer
 * sits in its own box (`data-answer`), so a page can animate its height; `data-closing` marks a row on its way shut.
 */
export default function FAQItem({ question, children }: FAQItemProps) {
  return (
    <details className={styles.item}>
      <summary className={styles.question}>
        <h3>{question}</h3>
        <span className={styles.toggle} aria-hidden="true" />
      </summary>
      <div className={styles.body} data-answer="">
        <Prose className={styles.answer}>{children}</Prose>
      </div>
    </details>
  );
}
