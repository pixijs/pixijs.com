import { useState } from 'react';
import { dracula } from './defaults/theme';
import { EditorLayout } from './Sandpack/Layout';
import HTMLFile from '!!raw-loader!./defaults/index.html';
import StylesFile from '!!raw-loader!./defaults/styles.css';
import { SandpackProvider } from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';
import { useColorMode } from '@docusaurus/theme-common';

export interface EditorProps {
    showCode?: boolean;
    showPreview?: boolean;
    showConsole?: boolean;
    fullSizePreview?: boolean;
    width?: number | string;
    height?: number | string;
    dependencies?: Record<string, string>;
    files?: Record<string, { code: string; hidden?: boolean; active?: boolean } | string>;
    fontSize?: number;
}

export function Editor({
    showCode = true,
    showPreview = true,
    showConsole = false,
    fullSizePreview = false,
    width = '100%',
    height = '100%',
    dependencies = { 'pixi.js': 'latest' },
    files = { 'index.js': '// Your code here' },
    fontSize = 12,
}: EditorProps)
{
    const { colorMode } = useColorMode();

    // useResizeHandler(showPreview, setCodeVisibility);

    const [filesState] = useState({
        '/index.html': { code: HTMLFile, hidden: true },
        '/styles.css': { code: StylesFile, hidden: true },
        'sandbox.config.json': { code: `{"infiniteLoopProtection": false}`, hidden: true },
        'index.ts': { code: '', hidden: true, active: false },
        'index.js': {
            code: (files['index.js'] as string) ?? '// Your code here',
            hidden: false,
            active: true,
        },
    });

    return (
        <SandpackProvider
            template="vanilla-ts"
            theme={colorMode === 'dark' ? dracula : githubLight}
            files={filesState}
            customSetup={{ dependencies, entry: 'index.html' }}
            style={{ height, width, margin: '0 auto' }}
            options={{
                recompileDelay: 500,
            }}
        >
            <EditorLayout {...{ showCode, showPreview, showConsole, fontSize, fullSizePreview }} />
        </SandpackProvider>
    );
}
