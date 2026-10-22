import Icon from '@site/src/components/ui/Icon';
import styles from './Rail.module.scss';

/** Link props for a page that opens in a new tab */
export const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** The external-link icon a row shows on hover, and the "(opens in a new tab)" screen readers hear */
export default function NewTab() {
  return (
    <>
      <Icon name="external" size={12} strokeWidth={2} className={styles.external} />
      <span className={styles.srOnly}>(opens in a new tab)</span>
    </>
  );
}
