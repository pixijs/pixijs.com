import { useMemo } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

import CodeBlock from '@theme-original/CodeBlock';
import PixiPlayground from '@site/src/components/PixiPlayground';

import { examplesSource } from '@site/src/data/examples';
import styles from './index.module.css';

type ExamplesHash = typeof examplesSource;

type CodeBlockWrapperProps = { [key: string]: any } & {
    playground?: boolean;
    children: string;
};

type HashType = Record<string, any>;
type ExampleSourceLevelType = HashType | string | undefined;
type ExampleSourceType = string | undefined;

function getExampleSource(pathString: string, object: ExamplesHash): ExampleSourceType
{
    const path = pathString.split('.');

    return path.reduce(
        (objectLevel: ExampleSourceLevelType, levelKey) =>
            (objectLevel ? ((objectLevel as HashType)[levelKey] as ExampleSourceLevelType) : objectLevel),
        object,
    ) as ExampleSourceType;
}

export default function CodeBlockWrapper({ children, playground = false, ...rest }: CodeBlockWrapperProps)
{
    const isBrowser = useIsBrowser();
    const exampleContent = useMemo(() =>
        getExampleSource(children.trim(), examplesSource) || children, [children]);

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
