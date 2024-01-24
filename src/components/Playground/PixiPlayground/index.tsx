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
    useTabs: boolean;
    mode: BasePlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

function BasePlayground({ useTabs, mode, onCodeChanged }: BasePlaygroundProps)
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
                <MonacoEditor key={activeFile} useTabs={useTabs} onChange={onCodeChanged} />
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
    extraPackages?: Record<string, string>;
    activeFile?: string;
    isPixiWebWorkerVersion?: boolean;
    isPixiDevVersion?: boolean;
    pixiVersion?: string;
    mode?: BasePlaygroundMode;
    onCodeChanged?: CodeChangeCallbackType;
};

export default function PixiPlayground({
    code,
    extraFiles,
    extraPackages,
    activeFile,
    isPixiWebWorkerVersion = false,
    isPixiDevVersion = false,
    pixiVersion = latestVersion,
    mode = 'example',
    onCodeChanged,
}: PixiPlaygroundProps)
{
    const { colorMode } = useColorMode();

    const { key, files, customSetup } = useSandpackConfiguration({
        code,
        extraFiles,
        extraPackages,
        isPixiDevVersion,
        isPixiWebWorkerVersion,
        pixiVersion,
    });

    // We will show the passed in extra files on the editor tabs by default
    // and will hide any of them that has a key (file name) end with an '!'.
    const visibleExtraFiles = Object.keys(extraFiles ?? {})
        .filter((fileName) => !fileName.endsWith('!'))
        .map((fileName) => fileName.replace('*', '')) as any[];

    // If there is no activeFile paramater passed in, we will initially show 'index.js' by default
    // unless if there is an extra file that ends with an '*'
    // in which case we will show that file instead.
    const active
        = activeFile
        ?? (Object.keys(extraFiles ?? {}).find((fileName) => fileName.endsWith('*')) as any)?.replace('*', '')
        ?? 'src/index.js';

    // Hack to make the examples pages full width on wide screens
    useContainerClassNameModifier('example', mode === 'example');

    // Hack to make the code editor pages full width on wide screens
    useContainerClassNameModifier('coding', mode !== 'example');

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
                visibleFiles: ['src/index.js', ...visibleExtraFiles],
                activeFile: active,
            }}
        >
            <BasePlayground useTabs={!!extraFiles} mode={mode} onCodeChanged={onCodeChanged} />
        </SandpackProvider>
    );
}
