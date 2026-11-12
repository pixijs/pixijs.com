import Link from '@docusaurus/Link';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { useHistory, useLocation } from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import LazyEditor from '../Editor/LazyEditor';
import StepLink from './StepLink';
import StepMenu from './StepMenu';
import styles, { STYLESHEET } from './classes';
import Icon from '@site/src/components/ui/Icon';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import { usePackage } from '@site/src/shell/package';
import { getTutorials, type StepCode, type TutorialContent } from '@site/src/tutorials';

import type { EditorFiles } from '../Editor/Editor';
import type { PackageId } from '@site/src/data/packages';

interface TutorialProps {
  /** The page's slug, which also names exported projects */
  id: string;
  /** The tutorial's steps, imported by its page */
  content: TutorialContent;
  /** Defaults to the route's package */
  pkg?: PackageId;
}

type View = 'guide' | 'editor';

/** A step's code as editor files: `index` is `src/index.js`, `*` opens a file first and `!` hides its tab */
function stepFiles(code: StepCode): EditorFiles {
  if (typeof code === 'string') return { 'src/index.js': code };

  return Object.fromEntries(
    Object.entries(code).map(([key, source]) => {
      const name = key.replace(/[!*]/g, '');

      return [
        name === 'index' ? 'src/index.js' : name,
        { code: source, active: key.includes('*'), hidden: key.includes('!') },
      ];
    }),
  );
}

/** The step a `#N` hash names, if it's one of the tutorial's */
function stepOf(hash: string, count: number): number | undefined {
  const n = Number(/^#(\d+)$/.exec(hash)?.[1]);

  return n >= 1 && n <= count ? n : undefined;
}

/**
 * Before first paint on a `#N` deep link: marks `<html>` so CSS hides the server's step 1 until hydration renders
 * step N, instead of showing step 1 and swapping
 */
const pendingStepScript = (count: number) =>
  `var n=+(/^#(\\d+)$/.exec(location.hash)||[])[1];if(n>1&&n<=${count})document.documentElement.dataset.tutorialStep=n`;

/**
 * The step in the URL hash (`#3`); other hashes, such as heading anchors, keep the current step. Hydration starts on
 * the server's step 1; a client-side navigation starts on the hash's step.
 */
function useStep(count: number): [number, (step: number) => void] {
  const history = useHistory();
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const [step, setStep] = useState(() => (isBrowser && stepOf(location.hash, count)) || 1);

  useEffect(() => {
    const n = location.hash ? stepOf(location.hash, count) : 1;

    if (n) setStep(n);
  }, [location.hash, count]);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (root.dataset.tutorialStep === String(step)) delete root.dataset.tutorialStep;
  }, [step]);

  const go = (target: number) =>
    history.push({ pathname: location.pathname, search: location.search, hash: `#${target}` });

  return [step, go];
}

/**
 * A tutorial page: the step's text beside an editor holding the step's starting code, with a step list, Solution
 * and Reset, and Prev / Next. Below 997 px the text and the editor swap under a Guide / Editor switch. The step is
 * the URL hash (`#3`).
 */
export default function Tutorial({ id, content, pkg }: TutorialProps) {
  const { metadata } = useDoc();
  const current = usePackage();
  const pkgId = pkg ?? current.pkg ?? '2d';
  const { steps, extraPackages } = content;
  const [step, go] = useStep(steps.length);
  const [solvedStep, setSolvedStep] = useState(0);
  const [view, setView] = useState<View>('guide');
  const head = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const { Content, code, completedCode } = steps[step - 1];
  const solved = solvedStep === step && !!completedCode;
  const files = useMemo(() => stepFiles(solved && completedCode ? completedCode : code), [solved, code, completedCode]);
  const gallery = current.version.tutorials;
  const tutorials = getTutorials(pkgId, current.versionName);
  const next = tutorials[tutorials.findIndex((tutorial) => tutorial.id === id) + 1];
  const title = metadata.title;
  const label = current.versionName === 'current' ? current.def.label : `${current.def.label} ${current.version.label}`;

  const goTo = (target: number) => {
    moved.current = true;
    go(target);
  };

  /* A new step starts at the top of its text, and keyboard and screen reader users land on its heading */
  useEffect(() => {
    const el = body.current;

    if (!el) return;
    el.scrollTop = 0;
    if (!moved.current) return;
    moved.current = false;
    const heading = el.querySelector<HTMLElement>('h1');

    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div className={styles.tutorial} data-package={pkgId} data-view={view}>
      <style dangerouslySetInnerHTML={{ __html: STYLESHEET }} />
      <script dangerouslySetInnerHTML={{ __html: pendingStepScript(steps.length) }} />
      <section className={styles.guide} aria-label="Instructions">
        <header ref={head} className={styles.head}>
          <Link to={gallery} className={styles.back} aria-label="All tutorials" title="All tutorials">
            <Icon name="chevron-left" size={18} strokeWidth={2} />
          </Link>
          <p className={styles.title}>
            <small>{label} tutorial</small>
            {title}
          </p>
          <SegmentedControl<View>
            size="sm"
            className={styles.views}
            label="View"
            value={view}
            onChange={setView}
            options={[
              { value: 'guide', label: 'Guide' },
              { value: 'editor', label: 'Editor' },
            ]}
          />
          <StepMenu title={title} headers={steps.map((s) => s.header)} step={step} onGo={goTo} anchor={head} />
        </header>
        <div className={styles.progress} aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} data-done={i < step ? '' : undefined} />
          ))}
        </div>
        <div ref={body} className={styles.body} data-verify="tutorial-step">
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowTitle}>{title} ·</span>
            Step {step} of {steps.length}
          </p>
          <div className="markdown">
            <Content />
          </div>
          {step === steps.length &&
            (next ? (
              <Link to={`${gallery}/${next.id}`} className={styles.upNext}>
                {next.thumbnail && <img src={next.thumbnail} alt="" width={600} height={338} loading="lazy" />}
                <span>
                  <small>Up next</small>
                  <strong>{next.title}</strong>
                  {next.description}
                </span>
              </Link>
            ) : (
              <p className={styles.done}>
                That&apos;s every {label} tutorial so far. Keep going in the{' '}
                <Link to={current.version.examples}>examples</Link> or start something of your own in the{' '}
                <Link to={current.version.playground}>playground</Link>.
              </p>
            ))}
        </div>
        <nav className={styles.foot} aria-label="Step navigation" data-verify="tutorial-nav">
          {completedCode && (
            <button
              type="button"
              className={styles.solution}
              aria-pressed={solved}
              onClick={() => {
                setSolvedStep(solved ? 0 : step);
                setView('editor');
              }}
            >
              <Icon name={solved ? 'rotate-ccw' : 'eye'} size={16} />
              {solved ? 'Reset' : 'Solution'}
            </button>
          )}
          <span className={styles.spacer} />
          {step > 1 && (
            <StepLink step={step - 1} onGo={goTo} className={styles.prev} aria-label="Previous step">
              <Icon name="chevron-left" size={18} strokeWidth={2} />
            </StepLink>
          )}
          {step < steps.length ? (
            <StepLink step={step + 1} onGo={goTo} className={styles.next}>
              Next
              <Icon name="chevron-right" size={16} strokeWidth={2.25} />
            </StepLink>
          ) : (
            <Link to={next ? `${gallery}/${next.id}` : gallery} className={styles.next}>
              {next ? 'Next tutorial' : 'All tutorials'}
              <Icon name="arrow-right" size={16} strokeWidth={2.25} />
            </Link>
          )}
        </nav>
      </section>
      <div className={styles.work}>
        <LazyEditor
          files={files}
          pkg={pkgId}
          dependencies={extraPackages}
          name={`${id}-step-${step}`}
          rowFrom={1200}
          className={styles.editor}
        />
      </div>
    </div>
  );
}
