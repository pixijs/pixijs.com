import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';
import { Accent, Band, Closing } from '@site/src/components/Page';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import Button from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import Tag from '@site/src/components/ui/Tag';
import { motionAllowed } from '@site/src/motion/pause';
import {
  skillsClaudeInstall,
  skillsCopilotInstall,
  skillsUniversalInstall,
  skillsUsageExample,
} from '@site/src/data/llms/constants';
import { EASE, gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { usePackages } from '@site/src/shell/package';
import ClaudeLogo from '@site/static/images/ide-logos/claude.svg';
import CursorLogo from '@site/static/images/ide-logos/cursor.svg';
import VSCodeLogo from '@site/static/images/ide-logos/vscode.svg';
import WindsurfLogoDark from '@site/static/images/ide-logos/windsurf-dark.svg';
import WindsurfLogo from '@site/static/images/ide-logos/windsurf.svg';
import styles from './LLMs.module.scss';

import type { IconName } from '@site/src/components/ui/Icon';
import type { PackageId } from '@site/src/data/packages';
import type { KeyboardEvent, ReactNode } from 'react';

const REPO = 'https://github.com/pixijs/pixijs-skills';

type Tone = 'command' | 'output' | 'success' | 'prompt';

const TERMINAL: { prefix: string; text: string; tone: Tone }[] = [
  { prefix: '$', text: skillsUniversalInstall, tone: 'command' },
  { prefix: '→', text: 'Detecting agent…', tone: 'output' },
  { prefix: '✓', text: 'Installed 25 PixiJS skills for Claude Code', tone: 'success' },
  { prefix: '$', text: 'claude', tone: 'command' },
  { prefix: '>', text: 'Build a PixiJS v8 scene with Assets, Sprite, and ticker-driven animation.', tone: 'prompt' },
  { prefix: '✓', text: 'Using PixiJS skill for APIs, patterns, and examples', tone: 'success' },
];
/** Characters typed by the end of each line; the typing pauses there */
const LINE_ENDS = TERMINAL.map((_, index) =>
  TERMINAL.slice(0, index + 1).reduce((total, line) => total + line.text.length, 0),
);
const TERMINAL_LENGTH = LINE_ENDS[LINE_ENDS.length - 1];
const CHAR_MS = 11;
const LINE_MS = 240;

interface Agent {
  id: string;
  name: string;
  logo: ReactNode;
  /** Under the name in the picker */
  hint: string;
  tag?: string;
  /** Where the code goes, in the code block's title bar */
  where: string;
  /** Before the first line of code: `$` for a shell, `>` for an agent's prompt */
  prefix?: string;
  code: string;
  /** Menu steps before the code, for an editor setting */
  path?: string[];
  text: ReactNode;
  docs: { label: string; href: string };
}

const AGENTS: Agent[] = [
  {
    id: 'universal',
    name: 'Universal',
    logo: <Icon name="terminal" size={20} />,
    hint: 'One command, any agent',
    tag: 'Recommended',
    where: 'Terminal',
    prefix: '$',
    code: skillsUniversalInstall,
    text: 'Run it in your project. It detects your agent and installs all 25 skills, with no config.',
    docs: { label: 'pixijs-skills on GitHub', href: REPO },
  },
  {
    id: 'claude',
    name: 'Claude Code',
    logo: <ClaudeLogo />,
    hint: 'Plugin marketplace',
    where: 'Claude Code',
    prefix: '>',
    code: skillsClaudeInstall,
    text: "Use Claude Code's built-in plugin marketplace. Run this slash command in a Claude Code session.",
    docs: {
      label: 'Agent Skills docs',
      href: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview',
    },
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: <CursorLogo />,
    hint: 'Remote rule',
    where: 'Remote Rule (GitHub)',
    code: 'pixijs/pixijs-skills',
    path: ['Settings', 'Rules', 'Add Rule', 'Remote Rule (GitHub)'],
    text: 'Add the collection as a remote rule and paste in the repository name. The universal command works too.',
    docs: { label: 'Cursor Rules docs', href: 'https://docs.cursor.com/context/rules' },
  },
  {
    id: 'copilot',
    name: 'VS Code + Copilot',
    logo: <VSCodeLogo />,
    hint: 'Instructions file',
    where: 'Terminal',
    prefix: '$',
    code: skillsCopilotInstall,
    text: (
      <>
        Copilot doesn&apos;t load skill files, so copy the official <code>copilot-instructions.md</code> into your repo
        instead.
      </>
    ),
    docs: {
      label: 'Copilot customization docs',
      href: 'https://docs.github.com/en/copilot/concepts/response-customization',
    },
  },
];

/** The usage example's two blocks, each a `#` comment (a label, then any note after a comma) over a prompt */
const PROMPTS = skillsUsageExample.split('\n\n').map((block) => {
  const [comment, prompt] = block.split('\n');
  const [label, note] = comment.replace(/^#\s*/, '').split(/,\s*/);

  return { label, note, prompt };
});

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'sparkles',
    title: 'Official and maintained',
    text: 'Written by the PixiJS team and updated alongside the library.',
  },
  {
    icon: 'bot',
    title: '40+ agents supported',
    text: 'One install command covers Cursor, Claude Code, Codex, Windsurf, Copilot and more.',
  },
  {
    icon: 'layers',
    title: '25 focused skills',
    text: 'Separate skills for Application, Assets, Graphics, Filters, Mesh, Performance and more.',
  },
];

/** `true` for a moment after `copy` succeeds */
function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1600);

    return () => clearTimeout(timer);
  }, [copied]);

  return [copied, () => void navigator.clipboard.writeText(text).then(() => setCopied(true))];
}

/** Copies `text`, and says so: the icon pops to a tick and the label to "Copied" */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, copy] = useCopy(text);
  const icon = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (copied && icon.current && motionAllowed()) {
      gsap.fromTo(
        icon.current,
        { scale: 0.4, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.5, ease: EASE.pop },
      );
    }
  }, [copied]);

  return (
    <button
      type="button"
      className={styles.copy}
      aria-label={copied ? 'Copied' : `Copy ${label}`}
      data-copied={copied || undefined}
      onClick={copy}
    >
      <span ref={icon} className={styles.copyIcon}>
        <Icon name={copied ? 'check' : 'copy'} size={15} strokeWidth={2} />
      </span>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

interface CodeBlockProps {
  code: string;
  /** In the title bar: where the code is run */
  title: string;
  prefix?: string;
}

/** The homes' dark code card, for one command: a title bar with its copy button over the code */
function CodeBlock({ code, title, prefix }: CodeBlockProps) {
  return (
    <figure className={clsx('px-on-dark', styles.codeBlock)}>
      <figcaption className={styles.codeBar}>
        <span className={styles.dots} aria-hidden="true" />
        <span className={styles.codeTitle}>{title}</span>
        <CopyButton text={code} label="command" />
      </figcaption>
      <pre tabIndex={0}>
        <code>
          {code.split('\n').map((line, index) => (
            <span key={index} className={styles.codeLine}>
              {prefix && (
                <span className={styles.prefix} aria-hidden="true">
                  {index === 0 ? prefix : ' '}
                </span>
              )}
              <span data-code-text="">{line.trimStart()}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

/**
 * The install-then-prompt session, typed out once when it scrolls into view, on the seam under the header. Every
 * line is in the markup from the start and only hidden until typed, so the card never changes size; reduced or
 * paused motion shows it complete. Where it will type, CSS hides the lines from the first paint until it starts, so
 * the whole session never shows and then clears. It stands up as the page opens (CSS, so it moves from the first
 * paint) and leans back again as it scrolls away.
 */
function Terminal() {
  const root = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(TERMINAL_LENGTH);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = root.current;

    if (!el) return undefined;
    if (!motionAllowed()) {
      setStarted(true);

      return undefined;
    }
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStarted(true);
        let count = 0;
        const step = () => {
          setTyped(count);
          if (count >= TERMINAL_LENGTH) return;
          timer = window.setTimeout(step, LINE_ENDS.includes(count) ? LINE_MS : CHAR_MS);
          count += 1;
        };

        step();
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useMotion(root, (el) => {
    gsap.to(el, {
      rotationX: 12,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 0, end: 'bottom top', scrub: 0.6 },
    });
  });

  let start = 0;

  return (
    <div className={styles.stage}>
      <div
        ref={root}
        className={clsx('px-on-dark', styles.terminal)}
        data-typed={started ? '' : undefined}
        role="img"
        aria-label="Terminal session: install pixijs-skills with npx, then ask your agent to build a PixiJS scene."
      >
        <div className={styles.terminalBar} aria-hidden="true">
          <span className={styles.dots} />
          <span>pixijs-skills quick start</span>
          <span className={styles.terminalSteps}>install → prompt → build</span>
        </div>
        <div className={styles.terminalBody} aria-hidden="true">
          {TERMINAL.map(({ prefix, text, tone }, index) => {
            const shown = Math.max(0, Math.min(text.length, typed - start));
            const active = typed > start && typed < start + text.length;

            start += text.length;

            return (
              <div key={index} className={clsx(styles.line, styles[tone], shown === 0 && styles.pending)}>
                <span className={styles.prefix}>{prefix}</span>
                <span>
                  {text.slice(0, shown)}
                  <span className={styles.pending}>
                    {active && <span className={styles.cursor}>{text[shown]}</span>}
                    {text.slice(active ? shown + 1 : shown)}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The agents the skills name, as a strip under the terminal */
function WorksWith() {
  return (
    <ul className={styles.works} aria-label="Works with">
      <li>
        <ClaudeLogo aria-hidden="true" />
        Claude Code
      </li>
      <li>
        <CursorLogo aria-hidden="true" />
        Cursor
      </li>
      <li>
        <WindsurfLogo className={styles.onLight} aria-hidden="true" />
        <WindsurfLogoDark className={styles.onDark} aria-hidden="true" />
        Windsurf
      </li>
      <li>
        <VSCodeLogo aria-hidden="true" />
        VS Code
      </li>
      <li className={styles.more}>+40 more</li>
    </ul>
  );
}

/**
 * One agent at a time: a list of tabs beside the panel on wide screens, a grid of them over it on narrow ones. A
 * pink marker slides to the chosen tab and the panel's lines rise in, its command scrambling into place.
 */
function Installer() {
  const id = useId();
  const [active, setActive] = useState(AGENTS[0].id);
  const root = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const changed = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const list = marker.current?.parentElement;

    if (!list) return undefined;
    const place = (animate: boolean) => {
      const tab = tabs.current[active];

      if (!tab || !marker.current) return;
      const to = { x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight };

      if (animate) gsap.to(marker.current, { ...to, duration: 0.5, ease: EASE.out, overwrite: true });
      else gsap.set(marker.current, to);
      list.dataset.ready = '';
    };
    let observed = false;
    const observer = new ResizeObserver(() => {
      if (observed) place(false);
      observed = true;
    });

    place(changed.current && motionAllowed());
    observer.observe(list);

    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    const panel = root.current?.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');

    if (!changed.current || !panel || !motionAllowed()) return undefined;
    const tween = gsap.timeline();

    tween.fromTo(
      panel.querySelectorAll('[data-rise]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: EASE.out, stagger: 0.06 },
    );
    panel.querySelectorAll('[data-code-text]').forEach((line, index) => {
      tween.to(
        line,
        { scrambleText: { text: '{original}', chars: 'lowerCase', speed: 0.6 }, duration: 0.5 },
        index * 0.08,
      );
    });

    return () => void tween.progress(1).kill();
  }, [active]);

  const select = (next: string) => {
    changed.current = true;
    setActive(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    const index = AGENTS.findIndex((agent) => agent.id === active);
    const next =
      event.key === 'Home'
        ? AGENTS[0]
        : event.key === 'End'
          ? AGENTS[AGENTS.length - 1]
          : step && AGENTS[(index + step + AGENTS.length) % AGENTS.length];

    if (!next) return;
    event.preventDefault();
    select(next.id);
    tabs.current[next.id]?.focus();
  };

  return (
    <div ref={root} className={styles.installer} data-reveal="">
      <div className={styles.tabs} role="tablist" aria-label="Agent" onKeyDown={onKeyDown}>
        <span ref={marker} className={styles.marker} aria-hidden="true" />
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            ref={(el) => void (tabs.current[agent.id] = el)}
            type="button"
            role="tab"
            id={`${id}${agent.id}-tab`}
            aria-controls={`${id}${agent.id}`}
            aria-selected={agent.id === active}
            tabIndex={agent.id === active ? 0 : -1}
            className={styles.tab}
            onClick={() => select(agent.id)}
          >
            <span className={styles.logo}>{agent.logo}</span>
            <span className={styles.tabText}>
              <span className={styles.tabName}>{agent.name}</span>
              <span className={styles.tabHint}>{agent.hint}</span>
            </span>
          </button>
        ))}
      </div>
      {AGENTS.map((agent) => (
        <div
          key={agent.id}
          id={`${id}${agent.id}`}
          role="tabpanel"
          aria-labelledby={`${id}${agent.id}-tab`}
          hidden={agent.id !== active}
          className={styles.panel}
        >
          <div className={styles.panelHead} data-rise="">
            <h3>{agent.name}</h3>
            {agent.tag && <Tag tone="accent">{agent.tag}</Tag>}
          </div>
          <p data-rise="">{agent.text}</p>
          {agent.path && (
            <ol className={styles.path} aria-label="Menu path" data-rise="">
              {agent.path.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
          <div data-rise="">
            <CodeBlock code={agent.code} title={agent.where} prefix={agent.prefix} />
          </div>
          <a href={agent.docs.href} className={styles.docs} target="_blank" rel="noopener noreferrer" data-rise="">
            {agent.docs.label}
            <Icon name="external" size={13} strokeWidth={2} />
          </a>
        </div>
      ))}
    </div>
  );
}

interface TextFileProps {
  pkg: PackageId;
  name: string;
  path: string;
  /** Where "View" goes; defaults to the file itself */
  view?: string;
  /** The first lines of the file, for its preview */
  head: string[];
  children: ReactNode;
}

function TextFile({ pkg, name, path, view = `pathname://${path}`, head, children }: TextFileProps) {
  return (
    <Card as="li" className={styles.file}>
      <div className={styles.sheet} aria-hidden="true">
        <span className={styles.sheetName}>{path}</span>
        {head.map((line, index) => (
          <span key={index} className={clsx(styles.sheetLine, /^#/.test(line) && styles.sheetHead)}>
            {line || '\u00a0'}
          </span>
        ))}
      </div>
      <Tag pkg={pkg}>{name}</Tag>
      <h3>{path}</h3>
      <p>{children}</p>
      <div className={styles.fileActions}>
        <Button to={`pathname://${path}`} variant="small" icon="download" download>
          Download
        </Button>
        <Button to={view} variant="small" icon="external" data-verify="llms-view">
          View
        </Button>
      </div>
    </Card>
  );
}

export default function LLMsPage() {
  const version = usePackages()['2d'].versions.current.npm;
  const versioned = `https://pixijs.download/v${version}/docs/llms.txt`;

  return (
    <MotionPage>
      <ClayHeader
        eyebrow="AI"
        title={
          <>
            PixiJS <Accent>Skills</Accent>
          </>
        }
        lede={
          <>
            Teach your coding agent to write current PixiJS with the official <code>pixijs-skills</code> collection. One
            install command works with 40+ agents.
          </>
        }
        actions={
          <>
            <MagneticButton to={REPO} icon="github" arrow>
              View pixijs-skills
            </MagneticButton>
            <MagneticButton to="https://agentskills.io" variant="outline" glass>
              About Agent Skills
            </MagneticButton>
          </>
        }
        next="bg-alt"
        className={styles.header}
        clay={['octahedron-violet', 'sphere-cyan']}
      />

      <Band surface="bg-alt" glow label="Quick start">
        <Terminal />
        <WorksWith />
      </Band>

      <Band edge="a" labelledBy="install">
        <SectionHead
          id="install"
          eyebrow="Install"
          title="Pick your setup"
          lede="Start with the universal command, or use your agent's own install method."
        />
        <Installer />
      </Band>

      <Band surface="bg-alt" edge="c" flip labelledBy="use">
        <SectionHead
          id="use"
          eyebrow="Use"
          title="Prompt like you normally would"
          lede="Describe your PixiJS task and the agent loads the skills that fit. You can also name a skill to make the agent use it."
        />
        <ul className={styles.prompts}>
          {PROMPTS.map(({ label, note, prompt }, index) => (
            <li key={label} className={styles.promptCard} data-reveal="">
              <span className={styles.promptLabel}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {label}
              </span>
              <p className={styles.promptText}>
                <span className={styles.promptCaret} aria-hidden="true">
                  &gt;
                </span>
                {prompt}
              </p>
              <div className={styles.promptFoot}>
                <CopyButton text={prompt} label="prompt" />
                {note && <span>{note.replace(/^./, (letter) => letter.toUpperCase())}.</span>}
              </div>
            </li>
          ))}
        </ul>
        <ul className={styles.benefits}>
          {BENEFITS.map(({ icon, title, text }) => (
            <li key={title} data-reveal="">
              <span className={styles.benefitIcon}>
                <Icon name={icon} size={22} strokeWidth={1.75} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band edge="b" labelledBy="raw">
        <SectionHead
          id="raw"
          eyebrow="Raw docs"
          title="Plain text for any tool"
          lede={
            <>
              Skills are the better choice for coding agents, but an <code>llms.txt</code> file is handy for tools that
              take a URL, or for custom GPTs. Versioned copies are on{' '}
              <a href={versioned} target="_blank" rel="noopener noreferrer">
                pixijs.download
              </a>
              .
            </>
          }
        />
        <ul className={styles.files}>
          <TextFile
            pkg="2d"
            name="PixiJS"
            path="/llms.txt"
            view="https://pixijs.download/release/docs/llms.txt"
            head={[
              '# PixiJS',
              '',
              '> PixiJS is the fastest, most lightweight 2D library…',
              '',
              '## core-concepts',
              '- [Architecture](…/core-concepts.html.md): …',
              '- [Scene Graph](…/core-concepts-1.html.md): …',
              '- [Render Loop](…/core-concepts-2.html.md): …',
            ]}
          >
            An index of every PixiJS guide and API page, regenerated on each release. Each entry links to a Markdown
            copy of the page.
          </TextFile>
          <TextFile
            pkg="3d"
            name="PixiJS 3D"
            path="/3d/llms.txt"
            head={[
              '# PixiJS 3D',
              '',
              '> A 3D extension for PixiJS',
              '',
              '- [Introduction](…/intro.md): …',
              '- [Installation](…/installation.md): …',
              '- [Quick start](…/quick-start.md): …',
              '- [View3D and the 2D/3D bridge](…): …',
            ]}
          >
            An index of every PixiJS 3D guide. Each entry has a one-line summary and links to a Markdown copy.
          </TextFile>
        </ul>
        <Closing
          corners={{ bl: 'sphere-pink' }}
          title="Give your agent the docs"
          lede={
            <>
              <code>llms.txt</code> is a{' '}
              <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer">
                standard format
              </a>{' '}
              that gives an agent raw context. Skills give it patterns and examples too, and install with one command.
            </>
          }
          actions={
            <>
              <MagneticButton to={REPO} icon="github" arrow>
                Install pixijs-skills
              </MagneticButton>
              <MagneticButton to="/8.x/guides/getting-started/intro" variant="outline">
                Read the guides
              </MagneticButton>
            </>
          }
        />
      </Band>
    </MotionPage>
  );
}
