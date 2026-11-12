import Link from '@docusaurus/Link';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import { usePackage } from '@site/src/shell/package';
import PackageSwitch from '@site/src/shell/PackageSwitch';
import { getTutorials, type TutorialMeta } from '@site/src/tutorials';
import styles from './styles.module.scss';

import type { PackageId } from '@site/src/data/packages';

const LEDE: Record<PackageId, string> = {
  '2d': 'Build real projects one step at a time. Every step comes with a live editor, starting code and a solution.',
  '3d': 'Build 3D scenes one step at a time, from your first lit shape to a playable game. Every step comes with a live editor and a solution.',
};

const pad = (n: number) => String(n).padStart(2, '0');

function TutorialCard({ tutorial, index, to }: { tutorial: TutorialMeta; index: number; to: string }) {
  const { title, description, thumbnail, level, minutes, steps } = tutorial;

  return (
    <Card
      variant="link"
      to={to}
      accent="var(--px-accent)"
      className={styles.card}
      media={
        thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            width={600}
            height={338}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <span className={styles.blank} />
        )
      }
    >
      <p className={styles.meta}>
        <span>{pad(index + 1)}</span>
        {level}
      </p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.foot}>
        <span>
          {steps} steps{minutes ? ` · ${minutes} min` : ''}
        </span>
        <span className={styles.start}>
          Start
          <Icon name="arrow-right" size={14} strokeWidth={2} />
        </span>
      </p>
    </Card>
  );
}

/** The tutorials index of a package: a card per tutorial, and the 2D / 3D switch */
export default function TutorialGallery({ pkg = '2d' }: { pkg?: PackageId }) {
  const { versionName, packages } = usePackage();
  const tutorials = getTutorials(pkg, versionName);
  const version = packages[pkg].versions[versionName] ?? packages[pkg].versions.current;

  return (
    <div className={styles.gallery} data-package={pkg}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.heading}>Tutorials</h1>
          <p className={styles.lede}>{LEDE[pkg]}</p>
        </div>
        <PackageSwitch section="tutorials" className={styles.switch} />
      </header>
      {tutorials.length > 0 ? (
        <ol className={styles.grid} data-odd={tutorials.length % 2 ? '' : undefined}>
          {tutorials.map((tutorial, index) => (
            <li key={tutorial.id} data-verify="tutorial-card">
              <TutorialCard tutorial={tutorial} index={index} to={`${version.tutorials}/${tutorial.id}`} />
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>
          The first {packages[pkg].name} tutorials are on their way. Until they land, the{' '}
          <Link to={version.guides}>guides</Link> and <Link to={version.examples}>examples</Link> are the place to
          start.
        </p>
      )}
    </div>
  );
}
