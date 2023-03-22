import styles from './index.module.scss';
import features from './features.json';
import { useInView } from 'react-intersection-observer';

export default function FeatureList(): JSX.Element
{
    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <div className={`${styles.wrapper} padding--md padding-vert--xl`}>
            <div className="col col--12 margin-bottom--lg">
                <h2 className={`${styles.title} underline`}>PixiJS Features</h2>
            </div>
            <div ref={ref} className={`row ${styles.features}`}>
                {features.map((feature, index) =>
                {
                    if (!inView)
                    {
                        return null;
                    }

                    return (
                        <div
                            key={index}
                            className={`${styles.feature} col col--6`}
                            style={{
                                opacity: 0,
                                transform: 'translateX(300px)',
                                animation: `${index % 2 === 0 ? 'feature-r-in' : 'feature-l-in'}
                                0.9s cubic-bezier(0.5, 1, 0.5, 1)
                                ${0.4 * index}s forwards`,
                            }}
                        >
                            <img src={feature.icon} />
                            <div>
                                <h6>{feature.heading}</h6>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
