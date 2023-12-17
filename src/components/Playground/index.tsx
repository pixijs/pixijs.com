import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import Select from '@site/src/components/Select';
import { defaultExampleId, useCodeExamples } from '@site/src/components/Playground/PixiPlayground/useEditorCode';
import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';
import { usePlaygroundURLState } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';

import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Playground({ version }: { version: IVersion })
{
    const [urlState, setURLState] = usePlaygroundURLState({
        defaultExampleId,
        defaultPixiVersion: version.version,
    });
    const { source: urlSourceCode, exampleId: selectedOptionId } = urlState;

    const { sourceCode, usesWebWorkerLibrary, exampleOptions, handleOptionSelected, handleEditorCodeChanged }
        = useCodeExamples({
            urlSourceCode,
            selectedOptionId,
            setURLState,
        });

    return (
        <div className={styles.wrapper}>
            <BrowserOnly>
                {() => (
                    <>
                        <div className={styles.nav}>
                            <Select
                                label="Example:"
                                labelClassName={styles.select}
                                selectedId={selectedOptionId}
                                options={exampleOptions}
                                onValueChange={handleOptionSelected}
                            />
                        </div>
                        <PixiPlayground
                            code={sourceCode}
                            pixiVersion={version.npm}
                            isPixiDevVersion={version.dev}
                            isPixiWebWorkerVersion={usesWebWorkerLibrary}
                            onCodeChanged={handleEditorCodeChanged}
                            mode="fullscreen"
                        />
                    </>
                )}
            </BrowserOnly>
        </div>
    );
}
