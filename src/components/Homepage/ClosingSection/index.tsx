import HomeCTA from '../HomeCTA';
import styles from './index.module.scss';
import { useInView } from 'react-intersection-observer';

const animShortUp = (duration: number, delay: number) => ({
    opacity: 0,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
});

export default function ClosingSection(): JSX.Element
{
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    return (
        <div className={`${styles.closing} padding-vert--xl`}>
            <div ref={ref}>
                {inView && (
                    <>
                        <h3 className="short-up-anim" style={animShortUp(0.3, 0.25)}>
                            Elevate your Traditional HTML5 Techniques
                        </h3>
                        <h5 className="short-up-anim" style={animShortUp(0.3, 0.4)}>
                            Unbeatable performance, intuitive API, globally used and battle­tested.
                        </h5>
                        <div className="buttonRow">
                            <HomeCTA
                                anim="short-up-anim"
                                style={animShortUp(0.3, 0.55)}
                                label="Download"
                                link="https://github.com/pixijs/pixijs/releases"
                            />
                            &nbsp;
                            <HomeCTA
                                anim="short-up-anim"
                                style={animShortUp(0.3, 0.7)}
                                label="Get Started"
                                link="/tutorial"
                                outline={true}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
