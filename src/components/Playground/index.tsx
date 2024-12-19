import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import PixiPlayground from '@site/src/components/Playground/PixiPlayground';
import { defaultExampleId, useCodeExamples } from '@site/src/components/Playground/PixiPlayground/useEditorCode';
import { usePlaygroundURLState } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';
import Select from '@site/src/components/Select';

import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

export default function Playground({ pixiVersion }: { pixiVersion: IVersion })
{
    const [urlState, setURLState] = usePlaygroundURLState({
        defaultExampleId,
        defaultPixiVersion: pixiVersion.version,
    });
    const { state, exampleId: selectedOptionId } = urlState;

    const {
        indexCode,
        extraFiles,
        activeFile,
        usesWebWorkerLibrary,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    } = useCodeExamples({
        urlState: state,
        selectedOptionId,
        setURLState,
        pixiVersion,
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
                            code={indexCode}
                            extraFiles={extraFiles}
                            activeFile={activeFile}
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
