import Layout from '@theme/Layout';

import PixiPlayground from '@site/src/components/PixiPlayground';
import Select from '@site/src/components/Select';
import { defaultExampleId, useCodeExamples } from '@site/src/components/PixiPlayground/useEditorCode';
import { latestVersion, usePixiVersions } from '@site/src/components/PixiPlayground/usePixiVersions';
import { usePlaygroundURLState } from '@site/src/components/PixiPlayground/usePlaygroundURLState';

import styles from './playground.module.css';

export default function PlaygroundPage()
{
    const [urlState, setURLState] = usePlaygroundURLState({
        defaultExampleId,
        defaultPixiVersion: latestVersion,
    });
    const { source: urlSourceCode, exampleId: selectedOptionId, pixiVersion: selectedVersionId } = urlState;

    const { sourceCode, usesWebWorkerLibrary, exampleOptions, handleOptionSelected, handleEditorCodeChanged }
        = useCodeExamples({
            urlSourceCode,
            selectedOptionId,
            setURLState,
        });

    const { selectedVersion, handleVersionChanged, versionOptions } = usePixiVersions({
        selectedVersionId,
        setURLState,
    });
    const { npm, dev = false } = selectedVersion;

    return (
        <Layout title={'Playground'} noFooter wrapperClassName={styles.pageWrapper}>
            <div className={styles.playgroundWrapper}>
                <div className={styles.nav}>
                    <Select
                        className={styles.select}
                        selectedId={selectedOptionId}
                        options={exampleOptions}
                        onValueChange={handleOptionSelected}
                    />
                    <Select
                        className={styles.select}
                        selectedId={selectedVersionId}
                        options={versionOptions}
                        onValueChange={handleVersionChanged}
                    />
                </div>

                <PixiPlayground
                    code={sourceCode}
                    pixiVersion={npm}
                    isPixiDevVersion={dev}
                    isPixiWebWorkerVersion={usesWebWorkerLibrary}
                    onCodeChanged={handleEditorCodeChanged}
                    mode="fullscreen"
                />
            </div>
        </Layout>
    );
}
