import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import { scoped } from '../scoped';

const THEMES = ['dark', 'light'] as const;
/** `hm-still`: the home stylesheet gives it a backdrop on `/` and `/2d`; `/3d` passes its own `className` */
const styles = scoped();

interface StillProps {
  /** `/images/home/<dir>/<name>-<theme>.webp`, 1600 px wide, with an 800 px copy */
  name: string;
  /** The home it was drawn for: `2d` by PixiJS, `3d` by `scripts/render-home-3d.mjs` */
  dir?: '2d' | '3d';
  height?: number;
  className?: string;
}

/** A still drawn for a home card, transparent, one per theme; CSS lays out only the one in use */
export default function Still({ name, dir = '2d', height = 900, className }: StillProps) {
  const base = useBaseUrl(`/images/home/${dir}/${name}`);

  return (
    <span className={clsx(styles.still, className)}>
      {THEMES.map((theme) => (
        <img
          key={theme}
          data-on={theme}
          src={`${base}-${theme}.webp`}
          srcSet={`${base}-${theme}-800.webp 800w, ${base}-${theme}.webp 1600w`}
          sizes="(min-width: 997px) 54vw, 120vw"
          width={1600}
          height={height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ))}
    </span>
  );
}
