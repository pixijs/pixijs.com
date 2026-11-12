import clsx from 'clsx';
import { Highlight } from 'prism-react-renderer';
import { pixiDark } from '../../../theme/prism/pixi';
import Tag from '../../ui/Tag';
import styles from './styles';

import type { StageTab } from './types';

interface CodeCardProps {
  tabs: StageTab[];
  active: string;
}

/**
 * The text equivalent of the scene: every tab's code, highlighted at build time and stacked in one grid cell so the
 * card keeps the height of the longest snippet and never jumps when the tab changes. Always on the dark code theme.
 */
export default function CodeCard({ tabs, active }: CodeCardProps) {
  return (
    <div className={clsx(styles.codeCard, 'px-on-dark')}>
      <div className={styles.codeHead}>
        <span className={styles.file}>main.ts</span>
        {tabs.map((tab) => (
          <span key={tab.id} className={styles.chip} data-pane={tab.id} hidden={tab.id !== active}>
            <Tag pill>{tab.chip}</Tag>
          </span>
        ))}
      </div>
      <div className={styles.codeScroll} tabIndex={0} role="region" aria-label="Scene code" data-code-scroll="">
        <div className={styles.codeStack}>
          {tabs.map((tab) => (
            <Highlight key={tab.id} code={tab.code.trim()} language="ts" theme={pixiDark}>
              {({ tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={styles.code}
                  data-tab={tab.id}
                  aria-hidden={tab.id !== active}
                  style={{ visibility: tab.id === active ? 'visible' : 'hidden' }}
                >
                  <code>
                    {tokens.map((line, i) => (
                      <span key={i} {...getLineProps({ line })} className={styles.line} data-line="">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                        {'\n'}
                      </span>
                    ))}
                  </code>
                </pre>
              )}
            </Highlight>
          ))}
        </div>
      </div>
    </div>
  );
}
