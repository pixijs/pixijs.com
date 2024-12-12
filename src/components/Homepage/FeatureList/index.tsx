import { useInView } from 'react-intersection-observer';
import features from './features.json';
import styles from './index.module.scss';

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
                        className={`${styles.title} underline short-up-anim`}
                        style={
                            {
                                opacity: 0,
                                animationDuration: `0.3s`,
                                animationDelay: `0.5s`,
                            } as any
                        }
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

                    const halfListSize = features.length / 2;
                    // Calculate the animation delay based on the column and position
                    let delay = 0.5; // 0.5s is the delay for the title

                    if (column === 0)
                    {
                        delay += positionInColumn * 0.15;
                    }
                    else
                    {
                        delay = (positionInColumn + halfListSize) * 0.15;
                    }

                    return (
                        <div
                            key={index}
                            className={`${styles.feature} col col--6 ${feature['data-anim']}-anim`}
                            style={
                                {
                                    opacity: 0,
                                    transform: 'translateX(300px)',
                                    animationDelay: `${delay}s`,
                                } as any
                            }
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
