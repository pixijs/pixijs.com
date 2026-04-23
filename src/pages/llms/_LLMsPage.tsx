import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import { ArrowUpRight, BookOpen, Code, Download, ExternalLink, FileText, Rocket, Users } from 'lucide-react';
import React from 'react';
import styles from './LLMs.module.scss';
import { useClassModifier } from '../../hooks/useContainerClassNameModifier';
import ClaudeLogo from '@site/static/images/ide-logos/claude.svg';
import CursorLogo from '@site/static/images/ide-logos/cursor.svg';
import VSCodeLogo from '@site/static/images/ide-logos/vscode.svg';
import WindsurfLogo from '@site/static/images/ide-logos/windsurf.svg';
import WindsurfLogoDark from '@site/static/images/ide-logos/windsurf-dark.svg';
import {
  skillsClaudeInstall,
  skillsCopilotInstall,
  skillsUniversalInstall,
  skillsUsageExample,
} from '../../data/llms/constants';

const repoUrl = 'https://github.com/pixijs/pixijs-skills';

type TerminalTone = 'command' | 'output' | 'success' | 'prompt';

interface TerminalLine {
  prefix: string;
  text: string;
  tone: TerminalTone;
  speed?: number;
  pause?: number;
}

interface FileInfo {
  name: string;
  path: string;
  detailedDescription: string;
  features: string[];
  icon: React.ElementType;
}

const terminalLines: TerminalLine[] = [
  {
    prefix: '$',
    text: 'npx skills add https://github.com/pixijs/pixijs-skills',
    tone: 'command',
    speed: 14,
    pause: 500,
  },
  {
    prefix: '→',
    text: 'Detecting agent…',
    tone: 'output',
    speed: 16,
    pause: 350,
  },
  {
    prefix: '✓',
    text: 'Installed 25 PixiJS skills for Claude Code',
    tone: 'success',
    speed: 14,
    pause: 700,
  },
  {
    prefix: '$',
    text: 'claude',
    tone: 'command',
    speed: 22,
    pause: 400,
  },
  {
    prefix: '>',
    text: 'Build a PixiJS v8 scene with Assets, Sprite, and ticker-driven animation.',
    tone: 'prompt',
    speed: 14,
    pause: 900,
  },
  {
    prefix: '✓',
    text: 'Using PixiJS skill for APIs, patterns, and examples',
    tone: 'success',
    speed: 16,
    pause: 1500,
  },
];

const toneClassNames: Record<TerminalTone, string> = {
  command: styles.commandLine,
  output: styles.outputLine,
  success: styles.successLine,
  prompt: styles.promptLine,
};

const benefitCards = [
  {
    title: 'Official & maintained',
    description: 'Authored and updated by the PixiJS team alongside the library itself.',
    icon: BookOpen,
  },
  {
    title: '40+ agents supported',
    description: 'One install command covers Cursor, Claude Code, Codex, Windsurf, Copilot, and more.',
    icon: Users,
  },
  {
    title: 'Targeted expertise',
    description: '25 focused skills across Application, Assets, Graphics, Filters, Mesh, Performance, and more.',
    icon: Rocket,
  },
];

const files: FileInfo[] = [
  {
    name: 'llms.txt',
    path: '/llms.txt',
    detailedDescription: 'Lightweight navigation index optimized for quick context loading.',
    icon: FileText,
    features: ['Links to all documentation pages', 'Short descriptions for each section', 'Organized by category'],
  },
  {
    name: 'llms-medium.txt',
    path: '/llms-medium.txt',
    detailedDescription: 'Complete guides and tutorials without the full API reference.',
    icon: BookOpen,
    features: [
      'Complete guides and tutorials',
      'Optimized for medium context windows',
      'No API reference (smaller size)',
    ],
  },
  {
    name: 'llms-full.txt',
    path: '/llms-full.txt',
    detailedDescription: 'Complete API reference with all details in a single file.',
    icon: Code,
    features: [
      'Full documentation for all classes & functions',
      'Parameters, methods, and properties',
      'Working code examples',
    ],
  },
];

const TerminalAnimation: React.FC = () => {
  const [activeLineIndex, setActiveLineIndex] = React.useState(0);
  const [typedLength, setTypedLength] = React.useState(0);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const currentLine = terminalLines[activeLineIndex];

    if (!currentLine) {
      timeoutId = setTimeout(() => {
        setActiveLineIndex(0);
        setTypedLength(0);
      }, 1800);

      return () => clearTimeout(timeoutId);
    }

    if (typedLength < currentLine.text.length) {
      timeoutId = setTimeout(() => {
        setTypedLength((current) => current + 1);
      }, currentLine.speed ?? 16);

      return () => clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setActiveLineIndex((current) => current + 1);
      setTypedLength(0);
    }, currentLine.pause ?? 500);

    return () => clearTimeout(timeoutId);
  }, [activeLineIndex, typedLength]);

  return (
    <div className={styles.terminalShell}>
      <div className={styles.terminalTopBar}>
        <div className={styles.terminalMeta}>
          <div className={styles.terminalDots}>
            <span className={`${styles.terminalDot} ${styles.dotRed}`} />
            <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
            <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.terminalTitle}>pixijs-skills quick start</span>
        </div>
        <span className={styles.terminalStatus}>install → prompt → build</span>
      </div>

      <div className={styles.terminalBody} aria-hidden="true">
        {terminalLines.map((line, index) => {
          const isComplete = index < activeLineIndex || activeLineIndex >= terminalLines.length;
          const isActive = index === activeLineIndex && activeLineIndex < terminalLines.length;

          if (!isComplete && !isActive) {
            return null;
          }

          const visibleText = isComplete ? line.text : line.text.slice(0, typedLength);

          return (
            <div key={`${line.prefix}-${index}`} className={`${styles.terminalLine} ${toneClassNames[line.tone]}`}>
              <span className={styles.terminalPrefix}>{line.prefix}</span>
              <span className={styles.terminalText}>
                {visibleText}
                {isActive && <span className={styles.terminalCursor} />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LLMsPage: React.FC = () => {
  useClassModifier('.main-wrapper', 'tileBackground', true);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <main className={styles.llmsPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Official AI workflow</span>
          <h1 className="underline">PixiJS Skills</h1>
          <p className={styles.subtitle}>
            Teach your AI coding agent how to correctly use PixiJS v8 with the official{' '}
            <code className={styles.inlineCode}>pixijs-skills</code> collection. One install, 40+ agents supported.
          </p>

          <div className={styles.heroActions}>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              View pixijs-skills
              <ArrowUpRight size={16} />
            </a>
            <a
              href="https://agentskills.io"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              <ExternalLink size={16} />
              About Agent Skills
            </a>
          </div>

          <div className={styles.supportedStrip}>
            <span className={styles.supportedLabel}>Works with</span>
            <span className={styles.supportedLogos}>
              <ClaudeLogo className={styles.supportedLogo} aria-label="Claude Code" />
              <CursorLogo className={styles.supportedLogo} aria-label="Cursor" />
              {isDark ? (
                <WindsurfLogoDark className={styles.supportedLogo} aria-label="Windsurf" />
              ) : (
                <WindsurfLogo className={styles.supportedLogo} aria-label="Windsurf" />
              )}
              <VSCodeLogo className={styles.supportedLogo} aria-label="VS Code + Copilot" />
            </span>
            <span className={styles.supportedCount}>+40 more</span>
          </div>
        </div>
      </section>

      <section className={styles.showcaseSection}>
        <TerminalAnimation />
      </section>

      <section className={styles.installSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Install</span>
          <h2>Pick the path that fits your setup</h2>
          <p>
            The universal <code className={styles.inlineCode}>npx skills</code> command works for most agents. The
            IDE-specific routes below are useful if you prefer native plugin or rule workflows.
          </p>
        </div>

        <div className={styles.installGrid}>
          <article className={`${styles.installCard} ${styles.installCardWide}`}>
            <div className={styles.installCardHeader}>
              <div className={styles.installHeaderIcon}>
                <Code className={styles.installIcon} />
              </div>
              <div className={styles.installHeaderText}>
                <h3>Universal (recommended)</h3>
                <span className={styles.installBadge}>Works with 40+ agents</span>
              </div>
            </div>
            <p className={styles.cardDescription}>
              Drop the skill collection into your agent with a single command. No config required.
            </p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{skillsUniversalInstall}</pre>}>
                {() => <CodeBlock language="bash">{skillsUniversalInstall}</CodeBlock>}
              </BrowserOnly>
            </div>
          </article>

          <article className={styles.installCard}>
            <div className={styles.installCardHeader}>
              <ClaudeLogo className={styles.installLogo} />
              <div className={styles.installHeaderText}>
                <h3>Claude Code</h3>
              </div>
            </div>
            <p className={styles.cardDescription}>
              Use Claude&apos;s built-in plugin marketplace. Run this from Claude Code&apos;s slash-command prompt.
            </p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{skillsClaudeInstall}</pre>}>
                {() => <CodeBlock language="text">{skillsClaudeInstall}</CodeBlock>}
              </BrowserOnly>
            </div>
            <a
              href="https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Agent Skills docs
            </a>
          </article>

          <article className={styles.installCard}>
            <div className={styles.installCardHeader}>
              <CursorLogo className={styles.installLogo} />
              <div className={styles.installHeaderText}>
                <h3>Cursor</h3>
              </div>
            </div>
            <p className={styles.cardDescription}>
              Settings → Rules → Add Rule → Remote Rule (GitHub) and paste{' '}
              <code className={styles.inlineCode}>pixijs/pixijs-skills</code>. Or use the universal command above.
            </p>
            <a
              href="https://docs.cursor.com/context/rules"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.docsLink} ${styles.docsLinkStandalone}`}
            >
              <ExternalLink size={14} />
              Cursor Rules docs
            </a>
          </article>

          <article className={styles.installCard}>
            <div className={styles.installCardHeader}>
              <VSCodeLogo className={styles.installLogo} />
              <div className={styles.installHeaderText}>
                <h3>VS Code + Copilot</h3>
              </div>
            </div>
            <p className={styles.cardDescription}>
              Copilot doesn&apos;t load skill files, so copy the official{' '}
              <code className={styles.inlineCode}>copilot-instructions.md</code> into your repo instead.
            </p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{skillsCopilotInstall}</pre>}>
                {() => <CodeBlock language="bash">{skillsCopilotInstall}</CodeBlock>}
              </BrowserOnly>
            </div>
            <a
              href="https://docs.github.com/en/copilot/concepts/response-customization"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Copilot customization
            </a>
          </article>
        </div>
      </section>

      <section className={styles.usageSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Use</span>
          <h2>Prompt like you normally would</h2>
          <p>
            Once installed, describe your PixiJS task and the agent pulls in the relevant skills. You can also call the
            skill out by name when you want to be direct.
          </p>
        </div>

        <article className={styles.usageCard}>
          <div className={styles.installCardHeader}>
            <div className={styles.installHeaderIcon}>
              <FileText className={styles.installIcon} />
            </div>
            <div className={styles.installHeaderText}>
              <h3>Example prompts</h3>
            </div>
          </div>
          <div className={styles.codeBlockWrapper}>
            <BrowserOnly fallback={<pre className={styles.codeFallback}>{skillsUsageExample}</pre>}>
              {() => <CodeBlock language="markdown">{skillsUsageExample}</CodeBlock>}
            </BrowserOnly>
          </div>
        </article>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Why skills</span>
          <h2>Better PixiJS context for coding agents</h2>
          <p>
            Instead of hand-rolling prompts or pasting raw docs, point your agent at the official skill collection
            maintained by the PixiJS team.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefitCards.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article key={benefit.title} className={styles.benefitCard}>
                <div className={styles.benefitCardHeader}>
                  <Icon className={styles.benefitIcon} />
                  <h3>{benefit.title}</h3>
                </div>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.cardsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Raw docs</span>
          <h2>Need plain-text documentation too?</h2>
          <p>
            Prefer the skills workflow whenever possible, but these files remain useful for tools that accept a{' '}
            <code className={styles.inlineCode}>llms.txt</code> URL or for custom GPTs.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {files.map((file) => {
            const Icon = file.icon;

            return (
              <article key={file.name} className={styles.fileCard}>
                <div className={styles.fileNameRow}>
                  <Icon className={styles.fileIcon} />
                  <h3 className={styles.fileName}>{file.name}</h3>
                </div>

                <p className={styles.cardDescription}>{file.detailedDescription}</p>

                <ul className={styles.featureList}>
                  {file.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className={styles.buttonGroup}>
                  <a href={file.path} download={file.name} className={styles.downloadButton}>
                    <Download size={16} />
                    Download
                  </a>
                  <a href={file.path} target="_blank" rel="noopener noreferrer" className={styles.viewButton}>
                    <ExternalLink size={16} />
                    View
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className={styles.explainerText}>
          <code className={styles.inlineCode}>llms.txt</code> is a{' '}
          <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className={styles.standardLink}>
            standardized format
          </a>{' '}
          for AI-readable project documentation. It complements the official skills when you want raw context alongside
          a task-aware workflow.
        </p>
      </section>
    </main>
  );
};

export default LLMsPage;
