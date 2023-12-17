import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { getExampleEntry } from '@site/src/examples/v7.3.2';

export default function Example({ id, version }: { id: string; version: IVersion })
{
    const entry = getExampleEntry(id);
    const source = (entry?.source ?? entry) as string;

    return (
        <div className={styles.wrapper}>
            <BrowserOnly>
                {() => (
                    <PixiPlayground
                        code={source}
                        pixiVersion={version.npm}
                        isPixiDevVersion={version.dev}
                        isPixiWebWorkerVersion={entry?.usesWebWorkerLibrary}
                        mode="example"
                    />
                )}
            </BrowserOnly>
        </div>
    );
}
