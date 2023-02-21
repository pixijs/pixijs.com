import { useColorMode } from '@docusaurus/theme-common'
import React, { useEffect, useRef, useState } from 'react'

import { SandpackLayout, SandpackPreview, SandpackProvider, useActiveCode, useSandpack } from '@codesandbox/sandpack-react'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'

import styles from './index.module.scss'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const ROOT_DIR = 'inmemory://model/'

type PlaygroundMode = 'tutorial' | 'fullscreen' | 'example'

function MonacoEditor (): JSX.Element {
  const editorRef = useRef(null)
  const { code, updateCode } = useActiveCode()
  const { sandpack } = useSandpack()

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
          defaultLanguage="javascript"
          value={code}
          key={sandpack.activeFile}
          defaultValue={code}
          defaultPath={`${ROOT_DIR}/src/index.ts`}
          onChange={(value) => { updateCode(value ?? '') }}
          options={options}
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
        <SandpackPreview showOpenInCodeSandbox={true} className={styles.sandpackPreview} />
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
  const { siteConfig } = useDocusaurusContext()
  const { colorMode } = useColorMode()

  return (
    <SandpackProvider
      template="vanilla-ts"
      theme={colorMode}
      files={{
        '/src/index.ts': props.code
      }}
      customSetup={{}}
      options={{
        classes: {
          'sp-wrapper': styles.spWrapper,
          'sp-layout': styles.spLayout
        },
        externalResources: [
          'https://beta.pixijs.com/playground.css',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/pixi.min.js`,
          `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/graphics-extras.js`,
          `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/math-extras.js`,
          `https://pixijs.download/${siteConfig.customFields?.PIXI_VERSION}/packages/webworker.js`
        ]
      }}
    >
      <Playground mode={mode} onCodeChanged={props.onCodeChanged} />
    </SandpackProvider>
  )
}
