import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { getExampleEntry } from '@site/src/examples';
import { extractSource } from '../Playground/PixiPlayground/useEditorCode';

export default function Example({ id, pixiVersion }: { id: string; pixiVersion: IVersion })
{
    const entry = getExampleEntry(pixiVersion.version, id);
    const source = (entry?.source ?? entry) as string | Record<string, string>;
    const { indexCode, extraFiles } = extractSource(source);

    return (
        <div className={styles.wrapper}>
            <BrowserOnly>
                {() => (
                    <PixiPlayground
                        code={indexCode}
                        extraFiles={extraFiles}
                        pixiVersion={pixiVersion.version}
                        isPixiDevVersion={pixiVersion.dev}
                        isPixiWebWorkerVersion={entry?.usesWebWorkerLibrary}
                        mode="example"
                    />
                )}
            </BrowserOnly>
        </div>
    );
}
