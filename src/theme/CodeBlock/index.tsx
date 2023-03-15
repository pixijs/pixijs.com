import CodeBlock from '@theme-original/CodeBlock';

import PixiPlayground from '../../components/PixiPlayground';
import styles from './index.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function CodeBlockWrapper(props: {
  playground: boolean;
  children: string;
}): JSX.Element
{
  const isBrowser = useIsBrowser();

  if (props.playground && isBrowser)
  {
    return (
      <div className={styles.playgroundCodeBlock}>
        <PixiPlayground code={props.children} />
      </div>
    );
  }

  return <CodeBlock {...props} />;
}
