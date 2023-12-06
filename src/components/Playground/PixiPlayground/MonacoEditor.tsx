import { useCallback, useEffect, useRef } from 'react';
import type { editor } from 'monaco-editor';
import { useColorMode } from '@docusaurus/theme-common';
import Editor from '@monaco-editor/react';

const ROOT_DIR = 'inmemory://model/';

export type CodeChangeCallbackType = (code: string | undefined) => void;

type MonacoEditorProps = {
    code: string;
    onChange: CodeChangeCallbackType;
};

export default function MonacoEditor({ code, onChange }: MonacoEditorProps)
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

    return (
        <Editor
            defaultLanguage="javascript"
            value={code}
            defaultPath={`${ROOT_DIR}/src/index.ts`}
            onChange={onChange}
            options={options}
            onMount={handleEditorDidMount}
            theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
        />
    );
}
