import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import PixiPlayground from '@site/src/components/PixiPlayground';
import Select from '@site/src/components/Select';
import { useCodeExamples } from '@site/src/components/PixiPlayground/useEditorCode';

import styles from './playground.module.css';

function BrowserPixiPlayground()
{
    const { sourceCode, selectedOptionId, exampleOptions, handleOptionSelected, handleEditorCodeChanged }
        = useCodeExamples();

    return (
        <div>
            <PixiPlayground code={sourceCode} onCodeChanged={handleEditorCodeChanged} mode="fullscreen" />
            <Select
                className={styles.select}
                selectedId={selectedOptionId}
                options={exampleOptions}
                onValueChange={handleOptionSelected}
            />
        </div>
    );
}

export default function PlaygroundPage()
{
    return (
        <Layout title={'Playground'} noFooter wrapperClassName={styles.wrapper}>
            <BrowserOnly>{() => <BrowserPixiPlayground />}</BrowserOnly>
        </Layout>
    );
}
