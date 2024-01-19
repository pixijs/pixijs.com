import { useColorMode } from '@docusaurus/theme-common';
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { SandpackLayout, SandpackPreview, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react';
import { useContainerClassNameModifier } from '@site/src/hooks/useContainerClassNameModifier';
import { latestVersion } from './usePixiVersions';
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
    const { sandpack } = useSandpack();
    const [showOutput, setShowOutput] = useState(false);
    const { activeFile, bundlerState } = sandpack;

    const handleToggle = useCallback(() =>
    {
        setShowOutput((lastShowOutput) => !lastShowOutput);
    }, []);

    // TODO: we don't change the value of activeFile so why the key?
    return (
        <SandpackLayout className={classNames(styles[mode], showOutput && styles.showOutput)}>
            <div className={styles.editorWrapper}>
                <MonacoEditor key={activeFile} onChange={onCodeChanged} />
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
    extraFiles?: Record<string, string>;
    isPixiWebWorkerVersion?: boolean;
    isPixiDevVersion?: boolean;
    pixiVersion?: string;
    mode?: BasePlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

export default function PixiPlayground({
    code,
    extraFiles,
    isPixiWebWorkerVersion = false,
    isPixiDevVersion = false,
    pixiVersion = latestVersion,
    mode = 'example',
}: PixiPlaygroundProps)
{
    const { colorMode } = useColorMode();

    const { key, files, customSetup } = useSandpackConfiguration({
        code,
        extraFiles,
        isPixiDevVersion,
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
                // Only show .js file tabs
                visibleFiles: Object.keys(files).filter((fileName) => fileName.endsWith('.js')) as any[],
            }}
        >
            <BasePlayground mode={mode} />
        </SandpackProvider>
    );
}
