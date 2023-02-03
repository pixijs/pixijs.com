import React, { useEffect, useRef, useState } from 'react'
import { useColorMode } from '@docusaurus/theme-common'

import { SandpackProvider, SandpackLayout, SandpackPreview, useActiveCode, useSandpack } from '@codesandbox/sandpack-react'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'

import styles from './index.module.scss'

const PIXI_VERSION = '7.0.5'
const ROOT_DIR = 'inmemory://model/'

type PlaygroundMode = 'tutorial' | 'fullscreen' | 'example'

function MonacoEditor (): JSX.Element {
  const editorRef = useRef(null)
  const { code, updateCode } = useActiveCode()
  const { sandpack } = useSandpack()

  async function onBeforeMount (monaco: Monaco): Promise<void> {
    // Set tsconfig.json
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      moduleResolution: 2
      // allowSyntheticDefaultImports: true,
      // rootDir: ROOT,
    })

    const res = await fetch(`https://prod-packager-packages.codesandbox.io/v1/typings/pixi.js/${PIXI_VERSION}.json`)
    const json = await res.json()
    for (const file in json.files) {
      const code = json.files[file].module.code
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `${ROOT_DIR}node_modules${file}`)
    }
  }

  const handleEditorDidMount = (editor: any): void => {
    editorRef.current = editor
  }

  useEffect(() => {
    const resetEditorLayout = (): void => {
      if (editorRef.current != null) (editorRef.current as any).layout({})
    }

    window.addEventListener('resize', resetEditorLayout)
    return () => { window.removeEventListener('resize', resetEditorLayout) }
  }, [])

  const options: editor.IStandaloneEditorConstructionOptions = {
    lineNumbers: 'off',
    padding: {
      top: 24
    },
    minimap: {
      enabled: false
    },
    fontSize: 14,
    scrollBeyondLastLine: false,
    scrollbar: {
      alwaysConsumeMouseWheel: false
    }
  }

  const { colorMode } = useColorMode()

  return (
      <div className={styles.editorWrapper}>
        <Editor
          defaultLanguage="typescript"
          value={code}
          key={sandpack.activeFile}
          defaultValue={code}
          defaultPath={`${ROOT_DIR}/src/index.ts`}
          onChange={(value) => { updateCode(value ?? '') }}
          options={options}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          beforeMount={onBeforeMount}
          onMount={handleEditorDidMount}
          theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
        />
      </div>
  )
}

function Playground (props: { mode: PlaygroundMode, onCodeChanged?: (code: string | undefined) => void }): JSX.Element {
  const { code } = useActiveCode()
  const { sandpack } = useSandpack()
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    if (props.onCodeChanged != null) {
      props.onCodeChanged(code)
      return () => {
        if (props.onCodeChanged != null) {
          props.onCodeChanged(undefined)
        }
      }
    }
  })

  const handleToggle = (): void => {
    setShowOutput(!showOutput)
  }

  return (
    <SandpackLayout className={`${styles[props.mode]} ${showOutput ? styles.showOutput : ''}`}>
      <MonacoEditor />
      <div className={styles.previewWrapper}>
        <SandpackPreview showOpenInCodeSandbox={false} className={styles.sandpackPreview} />
        { (sandpack.bundlerState == null) && <div className={styles.sandpackLoadingOverlay}></div>}
      </div>
      <button onClick={handleToggle}>{showOutput ? 'Show Code' : 'Show Output'}</button>
    </SandpackLayout>
  )
}

export default function PixiPlayground (props: { mode?: PlaygroundMode, code: string, onCodeChanged?: (code?: string) => void }): JSX.Element {
  const mode = props.mode ?? 'example'

  // Hack to make the examples pages full width on wide screens
  useEffect(() => {
    const mainContainer = document.querySelector<HTMLDivElement>('main .container')
    if (mode === 'example' && mainContainer != null) {
      mainContainer.style.maxWidth = '100%'
      return () => {
        mainContainer.style.maxWidth = ''
      }
    }
  })
  const { colorMode } = useColorMode()

  return (
    <SandpackProvider
      template="vanilla-ts"
      theme={colorMode}
      files={{
        '/src/index.ts': props.code
      }}
      customSetup={{
        dependencies: {
          'pixi.js': PIXI_VERSION
        }
      }}
      options={{
        classes: {
          'sp-wrapper': styles.spWrapper,
          'sp-layout': styles.spLayout
        },
        externalResources: [
          'https://v2-pixijs.com/playground.css'
        ]
      }}
    >
      <Playground mode={mode} onCodeChanged={props.onCodeChanged} />
    </SandpackProvider>
  )
}
