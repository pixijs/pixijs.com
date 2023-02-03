/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'
import styles from './index.module.scss'
import Link from '@docusaurus/Link'
import BrowserOnly from '@docusaurus/BrowserOnly'
import PixiPlayground from '../PixiPlayground'
import { TutorialStep } from '@site/src/data/tutorial/TutorialData'

export default function Tutorial ({ data }: { data: TutorialStep[] }): JSX.Element {
  const [showEditor, setShowEditor] = useState(false)
  const handleEditorToggle = (): void => {
    setShowEditor(!showEditor)
  }

  return (
    <div className={`${styles.wrapper} ${showEditor ? styles.showEditor : ''}`}>
        <button onClick={handleEditorToggle} className={styles.editorToggle}>{showEditor ? '<  To Instructions' : 'To Editor >'}</button>
        {
            typeof window !== 'undefined'
              ? (
                    <BrowserOnly>
                        {() => {
                          let step = Number(window.location.hash.replace('#', ''))

                          if (!step || step <= 0 || step > data.length) step = 1
                          window.location.hash = step.toString()

                          const { Content, code, completedCode } = data[step - 1]
                          const [showSolution, setShowSolution] = useState(false)

                          const resetSolutionShowed = (): void => { setShowSolution(false) }
                          const handleSolutionToggle = (): void => { setShowSolution(!showSolution) }

                          return (
                            <>
                              <div className={styles.content}>
                                  <div className={styles.card}>
                                  <div className={styles.navigator}>
                                      <div className={styles.interactionArea}></div>
                                      <span>{`${step} / ${data.length}`}</span>
                                      <ul className={styles.dropdown}>
                                      { data.map((data, i) => (
                                          <Link key={i} onClick={resetSolutionShowed} to={`#${i + 1}`}>
                                          <div className={`${i === step - 1 ? styles.selected : ''}`}>{`${i + 1}.  ${data.title}`}</div>
                                          </Link>
                                      ))}
                                      </ul>
                                  </div>
                                  <Content />
                                  { completedCode && <button onClick={handleSolutionToggle}>{showSolution ? 'Reset' : 'Solution'}</button> }
                                  <div className={styles.footer}>
                                      { step > 1 && <Link onClick={resetSolutionShowed} className={styles.prev} to={`#${step - 1}`}>{'<  Prev'}</Link> }
                                      { step < data.length && <Link onClick={resetSolutionShowed} className={styles.next} to={`#${step + 1}`}>{'Next  >'}</Link> }
                                  </div>
                                  </div>
                              </div>
                              <PixiPlayground mode='tutorial' code={completedCode && showSolution ? completedCode : code} />
                            </>
                          )
                        }}
                    </BrowserOnly>
                )
              : (<h1 className={styles.loader}>LOADING...</h1>)
        }
    </div>
  )
}
