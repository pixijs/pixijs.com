import styles from './index.module.scss';
import features from './features.json';
import { useInView } from 'react-intersection-observer';

export default function FeatureList(): JSX.Element
{
    const [refFeatures, inViewFeat] = useInView({
        triggerOnce: true,
    });

    const [refTitle, inViewTitle] = useInView({
        triggerOnce: true,
    });

    return (
        <div className={`${styles.wrapper} padding--md padding-vert--xl`}>
            <div ref={refTitle} className="col col--12 margin-bottom--lg">
                {inViewTitle && (
                    <h2
                        className={`${styles.title} underline`}
                        style={{
                            opacity: 0,
                            animation: 'short-up 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s forwards',
                        }}
                    >
                        PixiJS Features
                    </h2>
                )}
            </div>
            <div ref={refFeatures} className={`row ${styles.features}`}>
                {features.map((feature, index) =>
                {
                    if (!inViewFeat)
                    {
                        return null;
                    }

                    // Determine the column number (0-based) and the position within the column
                    const column = index % 2;
                    const positionInColumn = Math.floor(index / 2);

                    // Calculate the animation delay based on the column and position
                    const delay
                        = column === 0
                            ? positionInColumn * 0.15 + 0.5 // 0.5s is the delay for the title
                            : (positionInColumn + features.length / 2) * 0.15 + 0.5;

                    return (
                        <div
                            key={index}
                            className={`${styles.feature} col col--6`}
                            style={{
                                opacity: 0,
                                transform: 'translateX(300px)',
                                animation: `${feature['data-anim']}
                                0.5s cubic-bezier(0.215, 0.61, 0.355, 1)
                                ${delay}s forwards`,
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
