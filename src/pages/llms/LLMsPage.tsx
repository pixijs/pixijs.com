import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import { Download, ExternalLink, FileText, BookOpen, Code } from 'lucide-react';
import React from 'react';
import styles from './LLMs.module.scss';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/Sponsor/card/Card';
import CursorLogo from '@site/static/images/ide-logos/cursor.svg';
import VSCodeLogo from '@site/static/images/ide-logos/vscode.svg';
import WindsurfLogo from '@site/static/images/ide-logos/windsurf.svg';
import WindsurfLogoDark from '@site/static/images/ide-logos/windsurf-dark.svg';
import ClaudeLogo from '@site/static/images/ide-logos/claude.svg';
import {
  cursorProjectRules,
  vscodeInstructions,
  windsurfGlobalRules,
  claudeCodeExample,
  claudeSlashCommand,
  claudeInlineContext,
  chatGptQuickContext,
} from '../../data/llms/constants';
import { useClassModifier } from '@site/src/hooks/useContainerClassNameModifier';

interface FileInfo {
  name: string;
  path: string;
  description: string;
  detailedDescription: string;
  features: string[];
  icon: React.ElementType;
}

interface IDESection {
  title: string;
  description?: string;
  filePath?: string;
  code?: string;
  language?: string;
}

interface IDEConfig {
  name: string;
  logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  docsUrl: string;
  sections: IDESection[];
}

const ideConfigs: IDEConfig[] = [
  {
    name: 'Cursor',
    logo: CursorLogo,
    docsUrl: 'https://docs.cursor.com/context/rules',
    sections: [
      {
        title: 'OPTION 1: PROJECT RULES',
        description: "Add the documentation to your project's context for AI-assisted coding.",
        filePath: '.cursor/rules/pixijs.mdc',
        language: 'yaml',
        code: cursorProjectRules,
      },
      {
        title: 'OPTION 2: MANUAL CONTEXT',
        description: 'Download llms.txt and add it to your project, then reference it with @llms.txt in chat.',
      },
    ],
  },
  {
    name: 'VS Code + Copilot',
    logo: VSCodeLogo,
    docsUrl: 'https://code.visualstudio.com/docs/copilot/customization/custom-instructions',
    sections: [
      {
        title: 'INSTRUCTIONS FILE',
        description: 'Add custom instructions for GitHub Copilot Chat.',
        filePath: '.github/copilot-instructions.md',
        language: 'markdown',
        code: vscodeInstructions,
      },
    ],
  },
  {
    name: 'Windsurf',
    logo: WindsurfLogo,
    docsUrl: 'https://docs.windsurf.com/windsurf/cascade/memories',
    sections: [
      {
        title: 'GLOBAL RULES',
        description: 'Configure Cascade with PixiJS documentation context.',
        filePath: '.windsurf/rules/pixijs.md',
        language: 'markdown',
        code: windsurfGlobalRules,
      },
      {
        title: 'MEMORY',
        description: "Add llms.txt to Windsurf's Memories for persistent context within sessions.",
      },
    ],
  },
];

const files: FileInfo[] = [
  {
    name: 'llms.txt',
    path: '/llms.txt',
    description: 'Navigation index with links',
    detailedDescription: 'Lightweight navigation index optimized for quick context loading.',
    icon: FileText,
    features: ['Links to all documentation pages', 'Short descriptions for each section', 'Organized by category'],
  },
  {
    name: 'llms-medium.txt',
    path: '/llms-medium.txt',
    description: 'Guides and tutorials',
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
    description: 'Complete API documentation',
    detailedDescription: 'Complete API reference with all details in a single file.',
    icon: Code,
    features: [
      'Full documentation for all classes & functions',
      'Parameters, methods, and properties',
      'Working code examples',
    ],
  },
];

const LLMsPage: React.FC = () => {
  useClassModifier('.main-wrapper', 'tileBackground', true);
  const { colorMode } = useColorMode();

  const getIdeLogo = (ide: IDEConfig) => {
    if (ide.name === 'Windsurf') {
      return colorMode === 'dark' ? WindsurfLogoDark : WindsurfLogo;
    }
    return ide.logo;
  };

  return (
    <main className={styles.llmsPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">LLM Documentation</h1>
          <p className={styles.subtitle}>
            Structured documentation designed for AI coding assistants. Provide these files to Claude, ChatGPT, Cursor,
            or any other AI tool to give it accurate PixiJS context.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          {files.map((file) => {
            const Icon = file.icon;

            return (
              <Card key={file.name} className={styles.fileCard}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <div className={styles.fileNameRow}>
                      <Icon className={styles.fileIcon} />
                      <CardTitle className={styles.fileName}>{file.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{file.detailedDescription}</CardDescription>
                </CardHeader>
                <CardContent className={styles.cardContent}>
                  <ul className={styles.featureList}>
                    {file.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
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
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className={styles.explainerText}>
          <code className={styles.inlineCode}>llms.txt</code> is a{' '}
          <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className={styles.standardLink}>
            standardized format
          </a>{' '}
          (similar to <code className={styles.inlineCode}>robots.txt</code>) that provides AI assistants with structured
          documentation about a project.
        </p>
      </section>

      {/* IDE Integration Section */}
      <section className={styles.ideSection}>
        <h2>IDE Integration</h2>
        <div className={styles.ideGrid}>
          {ideConfigs.map((ide) => {
            const Logo = getIdeLogo(ide);

            return (
              <div key={ide.name} className={styles.ideCard}>
                <div className={styles.ideCardHeader}>
                  <Logo className={styles.ideLogo} />
                  <h3 className={styles.ideCardTitle}>{ide.name}</h3>
                </div>

                {ide.sections.map((section, sectionIndex) => (
                  <div key={`${ide.name}-${sectionIndex}`} className={styles.ideCardSection}>
                    <span className={styles.sectionLabel}>{section.title}</span>
                    {section.description && <p className={styles.sectionDescription}>{section.description}</p>}
                    {section.filePath && (
                      <div className={styles.filePath}>
                        <code>{section.filePath}</code>
                      </div>
                    )}
                    {section.code && (
                      <div className={styles.codeBlockWrapper}>
                        <BrowserOnly fallback={<pre className={styles.codeFallback}>{section.code}</pre>}>
                          {() => <CodeBlock language={section.language}>{section.code}</CodeBlock>}
                        </BrowserOnly>
                      </div>
                    )}
                  </div>
                ))}

                <a href={ide.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.docsLink}>
                  <ExternalLink size={14} />
                  Learn more
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Claude Code & CLI Tools Section */}
      <section className={styles.aiSection}>
        <div className={styles.aiSectionHeader}>
          <ClaudeLogo className={styles.aiLogo} />
          <h2>Claude</h2>
        </div>
        <div className={styles.aiGrid}>
          <div className={styles.aiCard}>
            <span className={styles.sectionLabel}>PROJECT INSTRUCTIONS</span>
            <p className={styles.sectionDescription}>
              Create <code className={styles.inlineCode}>CLAUDE.md</code> in your project root.
            </p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{claudeCodeExample}</pre>}>
                {() => <CodeBlock language="markdown">{claudeCodeExample}</CodeBlock>}
              </BrowserOnly>
            </div>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code/memory"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Learn more
            </a>
          </div>

          <div className={styles.aiCard}>
            <span className={styles.sectionLabel}>SLASH COMMAND</span>
            <p className={styles.sectionDescription}>
              Create <code className={styles.inlineCode}>.claude/commands/pixi.md</code> for reusable context.
            </p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{claudeSlashCommand}</pre>}>
                {() => <CodeBlock language="markdown">{claudeSlashCommand}</CodeBlock>}
              </BrowserOnly>
            </div>
            <p className={styles.noteText}>
              Invoke with <code className={styles.inlineCode}>/pixi</code> in chat.
            </p>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code/slash-commands"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Learn more
            </a>
          </div>

          <div className={styles.aiCard}>
            <span className={styles.sectionLabel}>INLINE CONTEXT</span>
            <p className={styles.sectionDescription}>Fetch docs directly in your prompt.</p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{claudeInlineContext}</pre>}>
                {() => <CodeBlock language="markdown">{claudeInlineContext}</CodeBlock>}
              </BrowserOnly>
            </div>
            <p className={styles.noteText}>
              Use <code className={styles.inlineCode}>llms.txt</code> for overview or{' '}
              <code className={styles.inlineCode}>llms-full.txt</code> for complete API details.
            </p>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code/overview"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* ChatGPT & Web Interfaces Section */}
      <section className={styles.aiSection}>
        <h2 className={styles.aiSectionTitle}>ChatGPT & Web Interfaces</h2>
        <div className={styles.aiGrid}>
          <div className={styles.aiCard}>
            <span className={styles.sectionLabel}>Custom GPT</span>
            <p className={styles.sectionDescription}>Create a custom GPT with PixiJS knowledge:</p>
            <ol className={styles.stepsList}>
              <li>
                Download <code className={styles.inlineCode}>llms.txt</code> from above
              </li>
              <li>Go to ChatGPT → Explore GPTs → Create</li>
              <li>
                Upload <code className={styles.inlineCode}>llms.txt</code> as a Knowledge file
              </li>
              <li>Add instructions to reference the documentation</li>
            </ol>
            <a
              href="https://help.openai.com/en/articles/8554397-creating-a-gpt"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Learn more
            </a>
          </div>

          <div className={styles.aiCard}>
            <span className={styles.sectionLabel}>Quick Context</span>
            <p className={styles.sectionDescription}>For one-off questions, paste the URL in your prompt.</p>
            <div className={styles.codeBlockWrapper}>
              <BrowserOnly fallback={<pre className={styles.codeFallback}>{chatGptQuickContext}</pre>}>
                {() => <CodeBlock language="markdown">{chatGptQuickContext}</CodeBlock>}
              </BrowserOnly>
            </div>
            <p className={styles.noteText}>Most AI assistants will fetch and parse the documentation automatically.</p>
            <a
              href="https://help.openai.com/en/articles/8843948-knowledge-in-gpts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              <ExternalLink size={14} />
              Learn more
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LLMsPage;
