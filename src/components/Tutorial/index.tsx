import { useEffect, useState } from 'react';
import PixiPlayground from '../Playground/PixiPlayground';
import { extractSource } from '../Playground/PixiPlayground/useEditorCode';
import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { type TutorialStep, getTutorialEntry } from '@site/src/tutorials';

import type React from 'react';
import type { IVersion } from '../Playground/PixiPlayground/usePixiVersions';

function BrowserTutorial({
  data,
  pixiVersion,
  extraPackages,
}: {
  data: TutorialStep[];
  pixiVersion: IVersion;
  extraPackages?: Record<string, string>;
}) {
  let step = Number(window.location.hash.replace('#', ''));

  if (!step || step <= 0 || step > data.length) step = 1;

  useEffect(() => {
    window.location.hash = step.toString();
  }, [step]);

  const { Content, code, completedCode } = data[step - 1];
  const [showSolution, setShowSolution] = useState(false);

  const resetSolutionShowed = (): void => {
    setShowSolution(false);
  };
  const handleSolutionToggle = (): void => {
    setShowSolution(!showSolution);
  };

  const { indexCode, extraFiles } = extractSource(code);
  const { indexCode: indexCodeCompleted, extraFiles: extraFilesCompleted } = extractSource(completedCode ?? code);

  return (
    <>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.navigator}>
            <div className={styles.interactionArea}></div>
            <span>{`${step} / ${data.length}`}</span>
            <ul className={styles.dropdown}>
              {data.map((datum, i) => (
                <Link key={i} onClick={resetSolutionShowed} to={`#${i + 1}`}>
                  <div className={`${i === step - 1 ? styles.selected : ''}`}>{`${i + 1}.  ${datum.header}`}</div>
                </Link>
              ))}
            </ul>
          </div>
          <Content />
          {completedCode && <button onClick={handleSolutionToggle}>{showSolution ? 'Reset' : 'Solution'}</button>}
          <div className={styles.footer}>
            {step > 1 && (
              <Link onClick={resetSolutionShowed} className={styles.prev} to={`#${step - 1}`}>
                {'<  Prev'}
              </Link>
            )}
            {step < data.length && (
              <Link onClick={resetSolutionShowed} className={styles.next} to={`#${step + 1}`}>
                {'Next  >'}
              </Link>
            )}
          </div>
        </div>
      </div>
      <PixiPlayground
        code={completedCode && showSolution ? indexCodeCompleted : indexCode}
        extraFiles={completedCode && showSolution ? extraFilesCompleted : extraFiles}
        extraPackages={extraPackages}
        pixiVersion={pixiVersion.version}
        isPixiDevVersion={pixiVersion.dev}
        mode="tutorial"
      />
    </>
  );
}

export default function Tutorial({ id, pixiVersion }: { id: string; pixiVersion: IVersion }): React.JSX.Element {
  const version = pixiVersion.version;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorToggle = (): void => {
    setShowEditor(!showEditor);
  };
  const entry = getTutorialEntry(version, id);

  return (
    <div className={`${styles.wrapper} ${showEditor ? styles.showEditor : ''}`}>
      <button onClick={handleEditorToggle} className={styles.editorToggle}>
        {showEditor ? '<  To Instructions' : 'To Editor >'}
      </button>
      <BrowserOnly fallback={<h1 className={styles.loader}>LOADING...</h1>}>
        {() => <BrowserTutorial data={entry.steps} pixiVersion={pixiVersion} extraPackages={entry.extraPackages} />}
      </BrowserOnly>
    </div>
  );
}
