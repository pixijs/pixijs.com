import classNames from 'classnames';
import { extractSource } from '../Playground/PixiPlayground/useEditorCode';
import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import { getExampleEntry } from '@site/src/examples';

import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

export default function Example({ id, pixiVersion, mode }: { id: string; pixiVersion: IVersion; mode?: any })
{
    const entry = getExampleEntry(pixiVersion.version, id);
    const source = (entry?.source ?? entry) as string | Record<string, string>;
    const { indexCode, extraFiles } = extractSource(source);

    return (
        <div className={classNames(styles.wrapper, mode === 'embedded' && styles.embedded)}>
            <BrowserOnly>
                {() => (
                    <PixiPlayground
                        code={indexCode}
                        extraFiles={extraFiles}
                        pixiVersion={pixiVersion.version}
                        isPixiDevVersion={pixiVersion.dev}
                        isPixiWebWorkerVersion={entry?.usesWebWorkerLibrary}
                        mode={mode ?? 'example'}
                    />
                )}
            </BrowserOnly>
        </div>
    );
}
