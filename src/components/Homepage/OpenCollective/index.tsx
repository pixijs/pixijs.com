import styles from './index.module.scss';
import useWidget from './openCollectiveWidget';

export default function ClosingSection(): JSX.Element
{
    useWidget();

    return <div id="openCollectiveWidget" className={`${styles.wrapper}`}></div>;
}
