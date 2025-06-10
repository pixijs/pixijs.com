import { PlaygroundEditor } from '../Editor/PlaygroundEditor';
import styles from './index.module.scss';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useCodeExamples } from '@site/src/components/Playground/PixiPlayground/useEditorCode';
import { usePlaygroundURLState } from '@site/src/components/Playground/PixiPlayground/usePlaygroundURLState';

import type { IVersion } from '@site/src/components/Playground/PixiPlayground/usePixiVersions';

export default function Playground({ pixiVersion }: { pixiVersion: IVersion }) {
  const [urlState, setURLState] = usePlaygroundURLState();
  const { state } = urlState;

  const { indexCode, handleEditorCodeChanged } = useCodeExamples({ urlState: state, setURLState, pixiVersion });

  return (
    <div className={styles.wrapper}>
      <BrowserOnly>
        {() => (
          <PlaygroundEditor
            files={{
              'index.js': indexCode,
            }}
            dependencies={{ 'pixi.js': pixiVersion.version }}
            handleEditorCodeChanged={handleEditorCodeChanged}
          />
        )}
      </BrowserOnly>
    </div>
  );
}
