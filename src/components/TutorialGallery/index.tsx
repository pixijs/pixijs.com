import styles from './index.module.scss';
import TutorialCard from './TutorialCard';
import { getTutorialCardsData } from '@site/src/tutorials';

import type { IVersion } from '../Playground/PixiPlayground/usePixiVersions';

export default function TutorialGallery({ pixiVersion }: { pixiVersion: IVersion }): JSX.Element
{
    const version = pixiVersion.version;
    const data = getTutorialCardsData(version);

    return (
        <div className={styles.tutorialGallery}>
            {data.map((card, i) => (
                <TutorialCard data={card} key={i} />
            ))}
        </div>
    );
}
