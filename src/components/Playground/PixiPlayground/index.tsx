import { useColorMode } from '@docusaurus/theme-common';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { SandpackLayout, SandpackPreview, SandpackProvider, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { useContainerClassNameModifier } from '@site/src/hooks/useContainerClassNameModifier';
import type { IVersion } from './usePixiVersions';
import { latestPixiVersion } from './usePixiVersions';
import MonacoEditor from './MonacoEditor';
import { useSandpackConfiguration } from './useSandpackConfiguration';
import type { CodeChangeCallbackType } from './MonacoEditor';

import styles from './index.module.scss';

type BasePlaygroundMode = 'tutorial' | 'fullscreen' | 'example';

type BasePlaygroundProps = {
    mode: BasePlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

function BasePlayground({ mode, onCodeChanged }: BasePlaygroundProps)
{
    // Override main container styling when in coding mode
    useEffect(() =>
    {
        const className = 'coding';
        const container = document.querySelector('.container');

        container?.classList.add(className);

        // Cleanup function to remove the class when the component is unmounted
        return () =>
        {
            container?.classList.remove(className);
        };
    }, []);

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
        [onCodeChanged, updateCode],
    );

    const handleToggle = useCallback(() =>
    {
        setShowOutput((lastShowOutput) => !lastShowOutput);
    }, []);

    // TODO: we don't change the value of activeFile so why the key?
    return (
        <SandpackLayout className={classNames(styles[mode], showOutput && styles.showOutput)}>
            <div className={styles.editorWrapper}>
                <MonacoEditor key={activeFile} code={code} onChange={handleCodeChange} />
            </div>

            <div className={styles.previewWrapper}>
                <SandpackPreview showOpenInCodeSandbox={true} />
                {!bundlerState && <div className={styles.sandpackLoadingOverlay}></div>}
            </div>

            <button onClick={handleToggle}>{showOutput ? 'Show Code' : 'Show Output'}</button>
        </SandpackLayout>
    );
}

type PixiPlaygroundProps = {
    code: string;
    isPixiWebWorkerVersion?: boolean;
    pixiVersion?: IVersion;
    mode?: BasePlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

export default function PixiPlayground({
    code,
    onCodeChanged,
    isPixiWebWorkerVersion = false,
    pixiVersion = latestPixiVersion,
    mode = 'example',
}: PixiPlaygroundProps)
{
    const { colorMode } = useColorMode();

    const { key, files, customSetup } = useSandpackConfiguration({
        code,
        isPixiWebWorkerVersion,
        pixiVersion,
    });

    // Hack to make the examples pages full width on wide screens
    useContainerClassNameModifier('example', mode === 'example');

    return (
        <SandpackProvider
            key={key}
            template="vanilla"
            theme={colorMode}
            files={files}
            customSetup={customSetup}
            options={{
                classes: {
                    'sp-wrapper': mode === 'tutorial' ? styles.tpWrapper : styles.spWrapper,
                    'sp-layout': styles.spLayout,
                },
            }}
        >
            <BasePlayground mode={mode} onCodeChanged={onCodeChanged} />
        </SandpackProvider>
    );
}
