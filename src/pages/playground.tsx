import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import PixiPlayground from '@site/src/components/PixiPlayground';
import Select from '@site/src/components/Select';
import { useCodeExamples } from '@site/src/components/PixiPlayground/useEditorCode';
import { usePixiVersions } from '@site/src/components/PixiPlayground/usePixiVersions';

import styles from './playground.module.css';

function BrowserPixiPlayground()
{
    const {
        sourceCode,
        usesWebWorkerLibrary,
        selectedOptionId,
        exampleOptions,
        handleOptionSelected,
        handleEditorCodeChanged,
    } = useCodeExamples();

    const { selectedVersionId, selectedVersion, handleVersionChanged, versionOptions } = usePixiVersions();
    const { npm, dev = false } = selectedVersion;

    return (
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
    );
}

export default function PlaygroundPage()
{
    return (
        <Layout title={'Playground'} noFooter wrapperClassName={styles.pageWrapper}>
            <BrowserOnly>{() => <BrowserPixiPlayground />}</BrowserOnly>
        </Layout>
    );
}
