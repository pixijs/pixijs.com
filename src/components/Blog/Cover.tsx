import { ECOSYSTEM_PACKAGES } from '@site/src/data/packages';
import styles from './classes';

import type { PostCardData } from './PostCard';

/** Tags every post or every release post carries, which say nothing about one */
const SERIES_TAGS = new Set(['PixiJS', 'Updates']);
const TITLE_VERSION = /v\d+(?:\.\d+)*|\d+\.\d+(?:\.\d+)?/;
const RELEASES = /v\d+\.\d+\.\d+/g;
const MONTH = new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' });

/**
 * A post card's picture: its front matter `image`, or a label drawn from the post. The package it's about (one it's
 * tagged with and names in its title or description, else PixiJS) in that package's colour, the version its title
 * names (else the releases its description lists, else its month), and its other tags.
 */
export default function Cover({ metadata, assets, frontMatter }: PostCardData) {
  const image = assets.image ?? frontMatter.image;

  if (image) {
    return (
      <span className={styles.cover}>
        <img src={image} alt="" loading="lazy" decoding="async" />
      </span>
    );
  }
  const { title, description, tags, date } = metadata;
  const pkg = ECOSYSTEM_PACKAGES.find(
    ({ label }) =>
      tags.some((tag) => tag.label === label) && new RegExp(`\\b${label}\\b`).test(`${title} ${description}`),
  );
  const named = TITLE_VERSION.exec(title)?.[0];
  const versions = named ? [named] : [...new Set(description.match(RELEASES))];
  const topics = tags.filter((tag) => !SERIES_TAGS.has(tag.label) && tag.label !== pkg?.label);
  const day = new Date(date);

  return (
    <span className={styles.cover} data-package={pkg?.token ?? '2d'} aria-hidden="true">
      <span className={styles.coverPackage}>
        {pkg?.label ?? 'PixiJS'}
        <span>{day.getUTCFullYear()}</span>
      </span>
      <span className={styles.coverHeadline}>
        {versions.length ? versions.map((version) => <span key={version}>{version}</span>) : MONTH.format(day)}
      </span>
      {topics.length > 0 && (
        <span className={styles.coverTopics}>
          {topics.map((tag) => (
            <span key={tag.permalink}>{tag.label}</span>
          ))}
        </span>
      )}
    </span>
  );
}
