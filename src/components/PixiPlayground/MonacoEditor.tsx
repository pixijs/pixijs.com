import { useCallback, useEffect, useRef } from 'react';
import type { editor } from 'monaco-editor';
import { useColorMode } from '@docusaurus/theme-common';
import Editor from '@monaco-editor/react';
import { FileTabs, SandpackStack, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';

export type CodeChangeCallbackType = (code: string | undefined) => void;

type MonacoEditorProps = {
    onChange?: CodeChangeCallbackType;
};

export default function MonacoEditor({ onChange }: MonacoEditorProps)
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

    return (
        <SandpackStack style={{ height: '100%', margin: 0 }}>
            <FileTabs />
            <Editor
                key={sandpack.activeFile}
                defaultLanguage="javascript"
                defaultValue={code}
                options={options}
                onMount={handleEditorDidMount}
                onChange={(value) =>
                {
                    updateCode(value || '');
                    onChange?.(value);
                }}
                theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
            />
        </SandpackStack>
    );
}
