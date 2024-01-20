import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import Select from '@site/src/components/Select';
import {
    defaultExampleId,
    useCodeExamples,
    useCodeSource,
} from '@site/src/components/Playground/PixiPlayground/useEditorCode';
import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';
import { usePlaygroundURLState } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';

import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Playground({ pixiVersion }: { pixiVersion: IVersion })
{
    const [urlState, setURLState] = usePlaygroundURLState({
        defaultExampleId,
        defaultPixiVersion: pixiVersion.version,
    });
    const { source: urlSourceCode, exampleId: selectedOptionId } = urlState;

    const {
        source: codeSource,
        usesWebWorkerLibrary,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    } = useCodeExamples({
        urlSourceCode,
        selectedOptionId,
        setURLState,
        pixiVersion,
    });

    const { indexCode, extraFiles } = useCodeSource(codeSource);

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
                            code={indexCode}
                            extraFiles={extraFiles}
                            pixiVersion={pixiVersion.version}
                            isPixiDevVersion={pixiVersion.dev}
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
