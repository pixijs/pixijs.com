import { useColorMode } from '@docusaurus/theme-common';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SandpackLayout, SandpackPreview, SandpackProvider, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import MonacoEditor from './MonacoEditor';
import type { CodeChangeCallbackType } from './MonacoEditor';

import styles from './index.module.scss';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type PlaygroundMode = 'tutorial' | 'fullscreen' | 'example';

type PlaygroundProps = {
    mode: PlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

function Playground({ mode, onCodeChanged }: PlaygroundProps)
{
    const { code, updateCode } = useActiveCode();
    const { sandpack } = useSandpack();
    const [showOutput, setShowOutput] = useState(false);
    const { activeFile, bundlerState } = sandpack;

    const handleCodeChange: CodeChangeCallbackType = useCallback(
        (nextCode) =>
        {
            const nextCodeString = nextCode ?? '';

            updateCode(nextCodeString);
            onCodeChanged?.(nextCodeString);
        },
        [onCodeChanged],
    );

    const handleToggle = () =>
    {
        setShowOutput(!showOutput);
    };

    // TODO: we don't change the value of activeFile so why the key?
    return (
        <SandpackLayout className={classNames(styles[mode], showOutput && styles.showOutput)}>
            <div className={styles.editorWrapper}>
                <MonacoEditor key={activeFile} code={code} onChange={handleCodeChange} />
            </div>

            <div className={styles.previewWrapper}>
                <SandpackPreview showOpenInCodeSandbox={true} className={styles.sandpackPreview} />
                {bundlerState === null && <div className={styles.sandpackLoadingOverlay}></div>}
            </div>

            <button onClick={handleToggle}>{showOutput ? 'Show Code' : 'Show Output'}</button>
        </SandpackLayout>
    );
}

type PixiPlaygroundProps = {
    code: string;
    mode?: PlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

export default function PixiPlayground({ code, onCodeChanged, mode = 'example' }: PixiPlaygroundProps)
{
    const { siteConfig } = useDocusaurusContext();
    const { colorMode } = useColorMode();

    // Hack to make the examples pages full width on wide screens
    // eslint-disable-next-line consistent-return
    useEffect(() =>
    {
        const mainContainer = document.querySelector<HTMLDivElement>('main .container');

        if (mode === 'example' && mainContainer !== null)
        {
            mainContainer.style.maxWidth = '100%';

            return () =>
            {
                mainContainer.style.maxWidth = '';
            };
        }
    }, [mode]);

    return (
        <SandpackProvider
            template="vanilla"
            theme={colorMode}
            files={{
                '/src/index.js': code,
            }}
            customSetup={{}}
            options={{
                classes: {
                    'sp-wrapper': styles.spWrapper,
                    'sp-layout': styles.spLayout,
                },
                externalResources: [
                    'https://beta.pixijs.com/playground.css',
                    `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/pixi.min.js`,
                    `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/graphics-extras.js`,
                    `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/math-extras.js`,
                    `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/webworker.js`,
                ],
            }}
        >
            <Playground mode={mode} onCodeChanged={onCodeChanged} />
        </SandpackProvider>
    );
}
