import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useEffect, useState } from 'react';
import VERSIONS_CSS from '!!raw-loader!sass-loader!./versions.scss';
import { usePixi3d } from '@site/src/components/Home/ThreeD/usePixi3d';
import { Accent, Band, Closing, panel } from '@site/src/components/Page';
import { pageClasses } from '@site/src/components/Page/classes';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import Tag from '@site/src/components/ui/Tag';
import { PIXI_V7_VERSION } from '@site/src/hooks/usePixiVersion';
import { usePackages } from '@site/src/shell/package';

import type { IconName } from '@site/src/components/ui/Icon';
import type { CSSProperties, ReactNode } from 'react';

const DOWNLOADS = 'https://pixijs.download';
const RELEASES = 'https://github.com/pixijs/pixijs/releases/tag';
const RELEASES_3D = 'https://github.com/pixijs/pixi-3d/releases';
const ARCHIVED = ['6.5.10', '5.3.12', '4.8.9'];
const styles = pageClasses('versions');

type Status = 'latest' | 'next' | 'archived' | 'beta';

const STATUS: Record<Status, ReactNode> = {
  latest: <Tag tone="accent">Latest</Tag>,
  next: <Tag>Unreleased</Tag>,
  archived: <Tag className={styles.muted}>Archived</Tag>,
  beta: <Tag pkg="3d">Closed beta</Tag>,
};

interface Row {
  version: string;
  status: Status;
  guides?: string;
  build?: boolean;
  notes?: boolean;
}

/** `7.4.2` → `v7`, the anchor of its release line */
const lineOf = (version: string) => `v${version.split('.')[0]}`;

/** Where a release's API docs, browser build and release notes are, from its tag (`v8.1.0`, or `dev`) */
const urlsOf = (ref: string) => ({
  api: `${DOWNLOADS}/${ref}/docs/index.html`,
  build: `${DOWNLOADS}/${ref}/pixi.min.js`,
  notes: `${RELEASES}/${ref}`,
});

/** The links an earlier line still has, as chips in one cell, so what it lacks leaves no empty column */
function Links({ version, guides, build, notes }: Row) {
  const urls = urlsOf(version === 'dev' ? 'dev' : `v${version}`);
  const links: [IconName, string, string | false | undefined][] = [
    ['newspaper', 'Guides', guides],
    ['code', 'API docs', urls.api],
    ['download', 'pixi.min.js', build && urls.build],
    ['sparkles', 'Release notes', notes && urls.notes],
  ];

  return (
    <ul className={styles.links}>
      {links.map(
        ([icon, label, to]) =>
          to && (
            <li key={label}>
              <Link to={to} className={styles.link}>
                <Icon name={icon} size={14} strokeWidth={2} />
                {label}
              </Link>
            </li>
          ),
      )}
    </ul>
  );
}

function VersionTable({ label, head, children }: { label: string; head: string[]; children: ReactNode }) {
  return (
    <div className={clsx(panel, styles.scroller)} role="region" aria-label={label} tabIndex={0} data-reveal="">
      <table className={styles.table}>
        <thead>
          <tr>
            {head.map((title) => (
              <th key={title} scope="col">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface Resource {
  icon: IconName;
  label: string;
  note: string;
  to?: string;
  /** Shown in place of the link while there isn't one */
  missing?: string;
}

/** A release line's own card: its version large, how to get it, and a tile for each thing it publishes */
function Release({
  id,
  version,
  status,
  pkg,
  resources,
  children,
}: {
  id: string;
  version: string;
  status: Status;
  pkg: '2d' | '3d';
  resources: Resource[];
  children: ReactNode;
}) {
  const [number, prerelease] = version.split(/-(.*)/);

  return (
    <article id={id} className={clsx(panel, styles.release)} data-package={pkg} data-reveal="">
      <div className={styles.releaseMain}>
        {STATUS[status]}
        <p className={styles.number}>
          {number}
          {prerelease && <span className={styles.prerelease}>-{prerelease}</span>}
        </p>
        {children}
      </div>
      <ul className={styles.resources}>
        {resources.map(({ icon, label, note, to, missing }) => {
          const tile = (
            <>
              <Icon name={icon} size={20} className={styles.resourceIcon} />
              <span className={styles.resourceText}>
                <span className={styles.resourceLabel}>{label}</span>
                <span className={styles.resourceNote}>{to ? note : missing}</span>
              </span>
            </>
          );

          return (
            <li key={label}>
              {to ? (
                <Link to={to} className={styles.resource}>
                  {tile}
                  <Icon name="arrow-right" size={16} strokeWidth={2} className={styles.resourceArrow} />
                </Link>
              ) : (
                <span className={clsx(styles.resource, styles.resourceOff)}>{tile}</span>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function Install({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className={clsx(styles.install, 'px-on-dark')}>
      <code>
        <span className={styles.prompt} aria-hidden="true">
          $
        </span>
        {command}
      </code>
      <button
        type="button"
        className={styles.copy}
        aria-label={copied ? 'Copied' : 'Copy the install command'}
        onClick={() => void navigator.clipboard?.writeText(command).then(() => setCopied(true))}
      >
        <Icon name={copied ? 'check' : 'copy'} size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

interface Stop {
  id: string;
  label: string;
  version: string;
  current?: boolean;
  pkg?: '3d';
}

/**
 * The release lines in order, as stops along a track under the header's copy; each one jumps to its line below. The
 * track draws in and the stops pop up along it as the page opens, in CSS, so they're hidden from the first paint.
 */
function Timeline({ stops }: { stops: Stop[] }) {
  return (
    <nav aria-label="Release lines" className={styles.timelineNav}>
      <ol className={styles.timeline}>
        {stops.map(({ id, label, version, current, pkg }, i) => (
          <li
            key={id}
            className={clsx(current && styles.current)}
            data-package={pkg}
            style={{ '--i': i } as CSSProperties}
          >
            <a href={`#${id}`} className={styles.stop}>
              <span className={styles.dot} />
              <span className={styles.stopText}>
                <span className={styles.stopLabel}>{label}</span>
                <span className={styles.stopVersion}>{version}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function Versions() {
  const pixi3d = usePixi3d();
  const packages = usePackages();
  const latest = packages['2d'].versions.current;
  const beta = packages['3d'].versions.current;
  const urls = urlsOf(`v${latest.npm}`);
  const older: Row[] = [
    { version: 'dev', status: 'next', build: true },
    { version: PIXI_V7_VERSION, status: 'archived', guides: packages['2d'].versions['7.x'].guides, notes: true },
    ...ARCHIVED.map((version): Row => ({ version, status: 'archived', notes: true })),
  ];
  const stops: Stop[] = [
    ...[...ARCHIVED].reverse().map((version) => ({ id: lineOf(version), label: lineOf(version), version })),
    { id: lineOf(PIXI_V7_VERSION), label: lineOf(PIXI_V7_VERSION), version: PIXI_V7_VERSION },
    { id: lineOf(latest.npm), label: lineOf(latest.npm), version: latest.npm, current: true },
    { id: '3d', label: '3D', version: beta.npm, pkg: '3d' },
  ];

  return (
    <Layout
      title="Versions"
      description="Guides, API docs, builds and release notes for every PixiJS version, and the current PixiJS 3D beta."
      wrapperClassName="shell-reading"
    >
      <MotionPage css={VERSIONS_CSS}>
        <ClayHeader
          eyebrow="Versions"
          title={
            <>
              Every version of <Accent>PixiJS</Accent>
            </>
          }
          lede="Guides, API docs, builds and release notes for each release line, in 2D and 3D."
          next="bg"
          clay={['cylinder-cyan', 'sphere-violet']}
        >
          <Timeline stops={stops} />
        </ClayHeader>

        <Band glow labelledBy="2d">
          <SectionHead
            id="2d"
            eyebrow="pixi.js"
            title="PixiJS"
            lede={
              <>
                On npm as <code>pixi.js</code>. Older versions stay online but aren&apos;t maintained any more.
              </>
            }
          />
          <Release
            id={lineOf(latest.npm)}
            version={latest.npm}
            status="latest"
            pkg="2d"
            resources={[
              {
                icon: 'newspaper',
                label: 'Guides',
                note: 'Concepts, components and walkthroughs',
                to: latest.guides,
              },
              {
                icon: 'code',
                label: 'API docs',
                note: 'Every class, option and event',
                to: urls.api,
              },
              {
                icon: 'download',
                label: 'pixi.min.js',
                note: 'The browser build, from the CDN',
                to: urls.build,
              },
              {
                icon: 'sparkles',
                label: 'Release notes',
                note: `What changed in ${latest.npm}`,
                to: urls.notes,
              },
            ]}
          >
            <Install command="npm install pixi.js" />
          </Release>

          <h3 className={styles.olderTitle}>Nightly and earlier lines</h3>
          <VersionTable label="Earlier PixiJS versions" head={['Version', 'Status', 'Links']}>
            {older.map((row) => (
              <tr key={row.version} id={row.version === 'dev' ? 'dev' : lineOf(row.version)}>
                <th scope="row">{row.version}</th>
                <td>{STATUS[row.status]}</td>
                <td>
                  <Links {...row} />
                </td>
              </tr>
            ))}
          </VersionTable>
        </Band>

        <Band surface="bg-alt" edge="a" labelledBy="3d-title">
          <SectionHead
            id="3d-title"
            eyebrow="@pixi/3d"
            title="PixiJS 3D"
            lede={
              <>
                Meshes, lights and glTF models for the PixiJS stage, as <code>@pixi/3d</code>. It&apos;s in closed beta,
                so the API can still change between releases.
              </>
            }
          />
          <Release
            id="3d"
            version={beta.npm}
            status="beta"
            pkg="3d"
            resources={[
              { icon: 'newspaper', label: 'Guides', note: 'Meshes, lights, materials and models', to: beta.guides },
              {
                icon: 'code',
                label: 'API docs',
                note: 'Every class, option and event',
                to: beta.api ?? undefined,
                missing: 'Coming soon',
              },
              {
                icon: 'sparkles',
                label: 'Changelog',
                note: 'What changed in each beta',
                to: pixi3d.status === 'public' ? RELEASES_3D : undefined,
                missing: 'Not public yet',
              },
              { icon: 'box', label: 'Overview', note: 'What PixiJS 3D adds to the stage', to: '/3d' },
            ]}
          >
            <Install command="npm install @pixi/3d" />
          </Release>
          <Closing
            corners={{ tl: 'octahedron-violet', tr: 'cube-pink', br: 'torus-pink' }}
            title="Upgrading from v7?"
            lede="The migration guide covers what changed in v8, including the async init and the new renderers."
            actions={
              <>
                <Button to="/8.x/guides/migrations/v8" arrow>
                  Migration guide
                </Button>
                <Button to={urls.notes} variant="outline" icon="github">
                  Release notes
                </Button>
              </>
            }
          />
        </Band>
      </MotionPage>
    </Layout>
  );
}
