import { useMemo } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

import CodeBlock from '@theme-original/CodeBlock';
import PixiPlayground from '@site/src/components/PixiPlayground';

import { getExampleSource } from '@site/src/data/examples';
import styles from './index.module.css';

type CodeBlockWrapperProps = { [key: string]: any } & {
    playground?: boolean;
    children: string;
};

export default function CodeBlockWrapper({ children, playground = false, ...rest }: CodeBlockWrapperProps)
{
    const isBrowser = useIsBrowser();
    const exampleContent = useMemo(() => getExampleSource(children.trim()) || children, [children]);

    if (playground && isBrowser)
    {
        return (
            <div className={styles.playgroundCodeBlock}>
                <PixiPlayground code={exampleContent} />
            </div>
        );
    }

    return <CodeBlock {...rest}>{exampleContent}</CodeBlock>;
}
