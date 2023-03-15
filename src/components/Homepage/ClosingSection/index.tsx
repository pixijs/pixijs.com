import HomeCTA from '../HomeCTA';
import styles from './index.module.scss';

export default function ClosingSection(): JSX.Element
{
    return (
        <div className={`${styles.closing} padding-vert--xl`}>
            <div>
                <h3>Elevate your Traditional HTML5 Techniques</h3>
                <h5>Unbeatable performance, intuitive API, globally used and battle­tested.</h5>
                <div className="buttonRow">
                    <HomeCTA label="Download" link="https://github.com/pixijs/pixijs/releases" />
                    &nbsp;
                    <HomeCTA label="Get Started" link="/tutorial" outline={true} />
                </div>
            </div>
        </div>
    );
}
