import { useCallback, useEffect, useRef } from 'react';
import { type SandpackState, FileTabs, SandpackStack, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import Editor, { useMonaco } from '@monaco-editor/react';

import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

export type CodeChangeCallbackType = (code: string | undefined, state: SandpackState) => void;

type MonacoEditorProps = {
    useTabs: boolean;
    onChange?: CodeChangeCallbackType;
};

export default function MonacoEditor({ useTabs, onChange }: MonacoEditorProps)
{
    const editorRef = useRef(null);

    const handleEditorDidMount = useCallback((editor: any) =>
    {
        editorRef.current = editor;
    }, []);

    useEffect(() =>
    {
        const resetEditorLayout = (): void =>
        {
            if (editorRef.current !== null) (editorRef.current as any).layout({});
        };

        window.addEventListener('resize', resetEditorLayout);

        return () =>
        {
            window.removeEventListener('resize', resetEditorLayout);
        };
    }, []);

    const options: editor.IStandaloneEditorConstructionOptions = {
        lineNumbers: 'off',
        padding: {
            top: 24,
        },
        minimap: {
            enabled: false,
        },
        fontSize: 14,
        scrollBeyondLastLine: false,
        scrollbar: {
            alwaysConsumeMouseWheel: false,
        },
    };

    const { colorMode } = useColorMode();
    const { code, updateCode } = useActiveCode();
    const { sandpack } = useSandpack();

    useEffect(() =>
    {
        const tab = document.querySelector('.sp-tab-button[data-active=true]');

        tab?.scrollIntoView(false);
    }, [sandpack.activeFile]);

    const getFileExtension = (filename: string): string =>
    {
        const parts = filename.split('.');

        return parts[parts.length - 1];
    };

    const getLanguage = (filename: string): string =>
    {
        const extension = getFileExtension(filename);

        switch (extension)
        {
            case 'js':
                return 'typescript';
            case 'ts':
                return 'typescript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'wgsl':
                return 'wgsl';
            default:
                return 'plaintext';
        }
    };

    const language = getLanguage(sandpack.activeFile);

    const monaco = useMonaco();

    function handleEditorWillMount(monaco: Monaco, version: string)
    {
        const urlCdn = `https://cdn.jsdelivr.net/npm/pixi.js@${version}/dist/pixi.js.d.ts`;

        fetch(urlCdn)
            .then((response) => response.text())
            .then((pixiTypes) =>
            {
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    `declare module 'pixi.js' { ${pixiTypes} }`,
                    `file:///node_modules/pixi.js/index.d.ts`,
                );
                console.log('Added pixi.js types to monaco:', pixiTypes);
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    `declare module '*.wgsl'
    {
        const shader: 'string';

        export default shader;
    }

    declare module '*.vert'
    {
        const shader: 'string';

        export default shader;
    }

    declare module '*.frag'
    {
        const shader: 'string';

        export default shader;
    }`,
                );
            })
            .catch((error) =>
            {
                console.error('Failed to fetch pixi.js types:', error);
            });
    }

    useEffect(() =>
    {
        const version = '8.6.6'; // specify the version you need

        if (monaco)
        {
            handleEditorWillMount(monaco, version);
        }
    }, [monaco]);

    return (
        <SandpackStack style={{ height: '100%', margin: 0 }}>
            {useTabs && <FileTabs />}
            <Editor
                key={sandpack.activeFile}
                defaultLanguage={language}
                defaultValue={code}
                options={options}
                onMount={handleEditorDidMount}
                onChange={(value) =>
                {
                    updateCode(value || '');
                    onChange?.(value, sandpack);
                }}
                theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
            />
        </SandpackStack>
    );
}
