import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { getExampleEntry } from '@site/src/examples';

export default function Example({ id, pixiVersion }: { id: string; pixiVersion: IVersion })
{
    const entry = getExampleEntry(pixiVersion.version, id);
    const source = (entry?.source ?? entry) as string;

    return (
        <div className={styles.wrapper}>
            <BrowserOnly>
                {() => (
                    <PixiPlayground
                        code={source}
                        pixiVersion={pixiVersion}
                        isPixiWebWorkerVersion={entry?.usesWebWorkerLibrary}
                        mode="example"
                    />
                )}
            </BrowserOnly>
        </div>
    );
}
