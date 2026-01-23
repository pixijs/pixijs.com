import styles from './index.module.scss';
import { useHistory } from '@docusaurus/router';

import type React from 'react';
import type { TutorialCardData } from '@site/src/tutorials';

export default function TutorialCard({ data }: { data: TutorialCardData }): React.JSX.Element {
  const history = useHistory();
  const title = camelCaseToSentenceCase(data.title);
  const thumb = `/assets/tutorials/thumbnails/${data.thumbnail ?? 'thumb_default.png'}`;
  const url = `tutorials/${camelCaseToSnakeCase(data.title)}`;

  return (
    <article className={styles.tutorialCard} onClick={() => history.push(url)}>
      <div className={styles.thumbnail} style={{ backgroundImage: `url(${thumb})` }} />
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{data.description}</p>
      </div>
    </article>
  );
}

function camelCaseToSentenceCase(str: string) {
  const tmp = str.replace(/([A-Z])/g, ' $1');

  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}

function camelCaseToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
