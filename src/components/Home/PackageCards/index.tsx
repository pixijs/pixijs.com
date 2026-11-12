import Link from '@docusaurus/Link';
import { useRef } from 'react';
import Badge from '@site/src/components/ui/Badge';
import Button from '@site/src/components/ui/Button';
import ClayShape from '@site/src/components/ui/Clay';
import Icon from '@site/src/components/ui/Icon';
import Tag from '@site/src/components/ui/Tag';
import { gsap, ScrollTrigger } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { usePackages } from '@site/src/shell/package';
import styles from '../classes';

import type { ClayShapeName } from '@site/src/components/ui/Clay';
import type { PackageDef } from '@site/src/data/packages';
import type { CSSProperties } from 'react';

/** Shape, centre in % of the panel, and size multiplier */
type Placed = [shape: ClayShapeName, left: number, top: number, k: number];

const CLAY: Placed[] = [
  ['sphere-violet', 19, 37, 1.15],
  ['pyramid-cyan', 30, 80, 0.7],
  ['cube-pink', 50, 56, 1.25],
  ['torus-cyan', 79, 34, 1.05],
  ['capsule-rose', 73, 80, 0.8],
];

/** A sprite's frame in the stage demo's atlas (`static/images/home/stage/sprites.json`) */
const FRAMES = {
  skully: [127, 2, 155, 165],
  eggHead: [284, 2, 142, 157],
  flowerTop: [428, 2, 119, 181],
  bunny: [549, 2, 78, 111],
} as const;

/** Sprite, its feet in % of the panel from the left and from the bottom, and its scale; drawn in this order */
type Standing = [sprite: keyof typeof FRAMES, left: number, bottom: number, k: number];

/** The 2D card's scene: the stage demo's monsters in a row, with bunnies caught mid-hop in front of them */
const SPRITES: Standing[] = [
  ['flowerTop', 50, 24, 0.33],
  ['eggHead', 24, 19, 0.33],
  ['skully', 76, 19, 0.33],
  ['bunny', 9, 9, 0.2],
  ['bunny', 37, 17, 0.2],
  ['bunny', 63, 8, 0.2],
  ['bunny', 91, 14, 0.2],
];

/** The cluster of each package: sprites from one atlas for 2D, clay for 3D, and what it's made of */
const VISUALS = {
  '2d': {
    tag: 'SPRITES · ONE DRAW CALL',
    cluster: SPRITES.map(([sprite, left, bottom, k], index) => {
      const [x, y, w, h] = FRAMES[sprite];

      return (
        <span
          key={index}
          className={styles.pkgSprite}
          data-sprite={sprite}
          style={
            {
              left: `${left}%`,
              bottom: `${bottom}%`,
              '--x': x,
              '--y': y,
              '--w': w,
              '--h': h,
              '--k': k,
            } as CSSProperties
          }
        />
      );
    }),
  },
  '3d': {
    tag: 'MESHES · LIGHTS · SHADOWS',
    cluster: CLAY.map(([shape, left, top, k]) => (
      <ClayShape
        key={shape}
        shape={shape}
        className={styles.pkgShape}
        style={{ left: `${left}%`, top: `${top}%`, '--k': k } as CSSProperties}
      />
    )),
  },
};

interface PackageCardProps {
  def: PackageDef;
  copy: string;
  visual: keyof typeof VISUALS;
}

function PackageCard({ def, copy, visual }: PackageCardProps) {
  const version = def.versions.current;
  const { tag, cluster } = VISUALS[visual];

  return (
    <article className={styles.pkgCard} data-package={def.id} data-pkg-card="">
      <div className={styles.pkgVisual} aria-hidden="true">
        <div className={styles.pkgCluster} data-cluster="">
          {cluster}
        </div>
        <Tag pkg={def.id} className={styles.pkgTag}>
          {tag}
        </Tag>
      </div>
      <div className={styles.pkgBody}>
        <p className={styles.pkgMeta}>
          <span className={styles.pkgDot} />
          {def.label}
          {def.badge && <Badge>{def.badge}</Badge>}
          <span className={styles.pkgVersion}>v{version.npm}</span>
        </p>
        <h3 className={styles.pkgTitle}>{def.name}</h3>
        <p className={styles.pkgCopy}>{copy}</p>
        <ul className={styles.pkgLinks}>
          <li>
            <Link to={version.guides}>Guides</Link>
          </li>
          <li>
            <Link to={version.tutorials}>Tutorials</Link>
          </li>
          <li>
            <Link to={version.examples}>Examples</Link>
          </li>
          <li>
            {version.api ? (
              <a href={version.api} target="_blank" rel="noopener noreferrer">
                API
                <Icon name="external" size={12} strokeWidth={2} />
              </a>
            ) : (
              <span className={styles.pkgSoon}>API · soon</span>
            )}
          </li>
        </ul>
        <div className={styles.pkgActions}>
          <Button to={def.home} variant="outline" arrow>
            Explore {def.label}
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * "Pick a dimension" (section 8.4 item 5): the 2D and 3D packages side by side, each with its links and what it
 * draws: sprites for 2D, clay for 3D. The cards rise in, and on a fine pointer they tilt toward it while the
 * cluster drifts the other way.
 */
export default function PackageCards() {
  const root = useRef<HTMLDivElement>(null);
  const packages = usePackages();

  useMotion(root, (el, { fine, paused, safe }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-pkg-card]', el);

    if (!paused && !ScrollTrigger.isInViewport(el, 0.1)) {
      gsap.from(cards, {
        y: 48,
        scale: 0.98,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    }
    if (!fine) return undefined;

    const removers = cards.map((card) => {
      const cluster = card.querySelector('[data-cluster]');
      const shapes = gsap.utils.toArray<HTMLElement>('[data-cluster] > *', card);
      const to = (target: Element | null, property: string) =>
        gsap.quickTo(target, property, { duration: 0.4, ease: 'power3' });
      const tilt = { x: to(card, 'rotationX'), y: to(card, 'rotationY') };
      const drift = { x: to(cluster, 'x'), y: to(cluster, 'y') };

      gsap.set(card, { transformPerspective: 900 });
      // Sprites rock on their feet and hop; clay bobs
      const enter = safe(() =>
        card.dataset.package === '2d'
          ? gsap.to(shapes, {
              keyframes: { rotation: [0, 7, -7, 0], y: [0, -10, 0, 0] },
              duration: 0.8,
              ease: 'sine.inOut',
              stagger: 0.05,
              overwrite: 'auto',
            })
          : gsap.to(shapes, { y: -8, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: 0.07 }),
      );
      const move = (event: PointerEvent) => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;

        tilt.x(y * -10);
        tilt.y(x * 10);
        drift.x(x * -15);
        drift.y(y * -15);
      };
      const leave = () => [tilt.x, tilt.y, drift.x, drift.y].forEach((reset) => reset(0));

      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);

      return () => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      };
    });

    return () => removers.forEach((remove) => remove());
  });

  return (
    <div ref={root} className={styles.pkgCards}>
      <PackageCard
        def={packages['2d']}
        visual="2d"
        copy="The 2D engine behind games, ads, apps and interactive sites for hundreds of global brands. It draws sprites, text, graphics and filters on WebGPU or WebGL."
      />
      <PackageCard
        def={packages['3d']}
        visual="3d"
        copy="It adds meshes, PBR materials, lights, shadows and glTF models to the same scene graph as your sprites."
      />
    </div>
  );
}
