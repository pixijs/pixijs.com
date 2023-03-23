import useIsBrowser from '@docusaurus/useIsBrowser';

import CodeBlock from '@theme-original/CodeBlock';
import PixiPlayground from '@site/src/components/PixiPlayground';

import styles from './index.module.css';

type CodeBlockWrapperProps = { [key: string]: any } & {
    playground?: boolean;
    children: string;
};

export default function CodeBlockWrapper({ children, playground = false, ...rest }: CodeBlockWrapperProps)
{
    const isBrowser = useIsBrowser();

    if (playground && isBrowser)
    {
        return (
            <div className={styles.playgroundCodeBlock}>
                <PixiPlayground code={children} />
            </div>
        );
    }

    return <CodeBlock {...rest}>{children}</CodeBlock>;
}
