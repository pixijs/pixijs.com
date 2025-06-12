// hooks/useCustomMonaco.ts
import { useEffect, useRef, useState } from 'react';
import { useFileLanguage } from './useFileLanguage';
import { usePixiMonaco } from './usePixiDefinitions';
import { FileTabs, SandpackStack, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { useColorMode } from '@docusaurus/theme-common';
import { Editor } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

import type * as monaco from 'monaco-editor';
import type { CSSProperties } from 'react';

export function useMonaco() {
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(null);
  const mountedRef = useRef(true);
  const loaderRef = useRef<any>(null);

  useEffect(() => {
    const instance = loader.__getMonacoInstance();

    if (instance) {
      setMonacoInstance(instance);

      return;
    }

    if (!loaderRef.current) {
      loader.config({
        'vs/nls': { availableLanguages: {} },
      });

      try {
        loaderRef.current = loader.init();

        loaderRef.current
          .then((monacoApi: typeof monaco) => {
            if (mountedRef.current) {
              setMonacoInstance(monacoApi);
            }
          })
          .catch((error: any) => {
            if (mountedRef.current && error.type !== 'cancelation') {
              console.error('Monaco initialization error:', error);
            }
          });
      } catch (err) {
        console.error('Failed to initialize Monaco:', err);
      }
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return monacoInstance;
}

interface MonacoViewProps {
  fontSize?: number;
  style?: CSSProperties;
  pixiVersion: string;
  handleEditorCodeChanged?: (nextSourceCode: string | undefined) => void;
}
export function MonacoView({ fontSize = 12, style, pixiVersion, handleEditorCodeChanged }: MonacoViewProps) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();
  const language = useFileLanguage(sandpack.activeFile);
  const { colorMode } = useColorMode();

  usePixiMonaco(monaco, pixiVersion);

  return (
    <SandpackStack style={{ height: '100%', margin: 0, ...style }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: colorMode === 'dark' ? '#1e1e1e' : '#FFFFFE' }}>
        <Editor
          width="100%"
          height="100%"
          language={language}
          theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => {
            updateCode(value || '');
            handleEditorCodeChanged?.(value);
          }}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            fontSize,
          }}
        />
      </div>
    </SandpackStack>
  );
}
