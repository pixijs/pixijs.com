import styles from './styles.module.scss';

import type { Props } from '@theme/DocRoot/Layout/Main';

/** Ejected (theme-classic 3.10.2): the docs column, full bleed on app routes */
export default function DocRootLayoutMain({ children }: Props) {
  return <main className={styles.main}>{children}</main>;
}
