import clsx from 'clsx';
import { Page, PageHeader } from '@site/src/components/Page';
import Button from '@site/src/components/ui/Button';
import ClayShape from '@site/src/components/ui/Clay';
import Rail from '@site/src/shell/Rail/Rail';
import { useRailOwner } from '@site/src/shell/ShellProvider';
import styles from './styles.module.scss';

import type { Props } from '@theme/NotFound/Content';

/**
 * The 404 page: a page header that is the whole page, with the code in pressed pink type round a clay torus. An
 * unknown path inside a docs instance renders here instead of `DocRoot/Layout`, so the rail comes along. Its motion
 * is CSS only, so the 404 doesn't bring GSAP.
 */
export default function NotFoundContent({ className }: Props) {
  return (
    <>
      {useRailOwner() === 'docs' && <Rail />}
      <Page>
        <main className={clsx(styles.notFound, className)}>
          <PageHeader
            className={styles.header}
            art={
              <div className={styles.code} aria-hidden="true">
                <span className={styles.digit}>4</span>
                <ClayShape shape="torus-pink" className={styles.shape} />
                <span className={styles.digit}>4</span>
              </div>
            }
            clay={['sphere-cyan', 'cube-violet']}
            eyebrow="Lost in the scene graph"
            title="Page not found"
            lede={
              <>
                The page you&apos;re looking for has moved or never existed. Try one of these
                <span className={styles.hint}>
                  , or press <kbd>/</kbd> to search
                </span>
                .
              </>
            }
            actions={
              <>
                <Button to="/">Home</Button>
                <Button to="/8.x/guides/getting-started/intro" variant="outline" glass>
                  Docs
                </Button>
                <Button to="/8.x/examples" variant="outline" glass>
                  Examples
                </Button>
              </>
            }
          />
        </main>
      </Page>
    </>
  );
}
