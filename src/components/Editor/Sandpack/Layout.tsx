import { useState } from 'react';
import { MonacoView } from '../Monaco/MonacoView';
import { ConsoleCounterButton } from './ConsoleCounterButton';
import { ToggleCodeButton } from './ToggleCodeButton';
import { SandpackConsole, SandpackLayout, SandpackPreview, SandpackStack } from '@codesandbox/sandpack-react';

import type { EditorProps } from '../Editor';

export function EditorLayout(
    props: Required<Pick<EditorProps, 'showCode' | 'showPreview' | 'showConsole' | 'fontSize' | 'fullSizePreview'>>,
)
{
    const { showCode, showPreview, showConsole, fontSize, fullSizePreview } = props;
    const [consoleVisibility, setConsoleVisibility] = useState(showConsole);
    const [codeVisibility, setCodeVisibility] = useState(showCode);

    const actionsChildren = (
        <>
            <ToggleCodeButton onClick={() => setCodeVisibility((prev) => !prev)} visible={codeVisibility} />
            <ConsoleCounterButton onClick={() => setConsoleVisibility((prev) => !prev)} />
        </>
    );

    return (
        <SandpackLayout style={{ height: '100%' }}>
            <MonacoView
                fontSize={fontSize}
                style={{
                    // eslint-disable-next-line no-nested-ternary
                    flexGrow: codeVisibility ? (fullSizePreview ? 4 : 1) : 0,
                    // eslint-disable-next-line no-nested-ternary
                    flexShrink: codeVisibility ? (fullSizePreview ? 4 : 1) : 0,
                    flexBasis: 0,
                    width: '100%',
                    overflow: 'hidden',
                }}
            />
            {showPreview && (
                <SandpackStack style={{ height: '100%', width: '100%' }}>
                    <SandpackPreview
                        style={{
                            flexGrow: 100,
                            flexShrink: 100,
                            flexBasis: 0,
                            overflow: 'hidden',
                        }}
                        showOpenInCodeSandbox={false}
                        actionsChildren={actionsChildren}
                    />
                    {consoleVisibility && (
                        <div
                            style={{
                                flexGrow: consoleVisibility ? 35 : 0,
                                flexShrink: consoleVisibility ? 35 : 0,
                                flexBasis: 0,
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <SandpackConsole showHeader={false} />
                        </div>
                    )}
                </SandpackStack>
            )}
        </SandpackLayout>
    );
}
