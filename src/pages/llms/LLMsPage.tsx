import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeBlock from '@theme/CodeBlock';
import { Download, ExternalLink, FileText, BookOpen, Code, Copy, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from './LLMs.module.scss';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/Sponsor/card/Card';
import CursorLogo from '@site/static/images/ide-logos/cursor.svg';
import VSCodeLogo from '@site/static/images/ide-logos/vscode.svg';
import WindsurfLogo from '@site/static/images/ide-logos/windsurf.svg';

interface FileInfo {
  name: string;
  path: string;
  description: string;
  detailedDescription: string;
  features: string[];
  icon: React.ElementType;
}

interface FileMetadata {
  size: number | null;
  lastModified: Date | null;
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
        code: `---
description: PixiJS API
globs: **/*.{js,ts,jsx,tsx}
alwaysApply: true
---

@https://pixijs.com/llms.txt`,
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
        code: `# PixiJS Context

When working with PixiJS,
refer to the API documentation at:
https://pixijs.com/llms.txt`,
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
        code: `When working with PixiJS, use the
API reference from:
https://pixijs.com/llms.txt`,
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `~${Math.round(bytes / 1024)}KB`;
  return `~${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const LLMsPage: React.FC = () => {
  const [metadata, setMetadata] = useState<Record<string, FileMetadata>>({});
  const [latestUpdate, setLatestUpdate] = useState<Date | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      const results: Record<string, FileMetadata> = {};
      let mostRecent: Date | null = null;

      await Promise.all(
        files.map(async (file) => {
          try {
            const response = await fetch(file.path, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type') || '';
            // Only use metadata if we got an actual text file, not an HTML fallback page
            if (response.ok && contentType.includes('text/plain')) {
              const size = parseInt(response.headers.get('Content-Length') || '0', 10);
              const lastModifiedHeader = response.headers.get('Last-Modified');
              const lastModified = lastModifiedHeader ? new Date(lastModifiedHeader) : null;

              results[file.name] = { size: size || null, lastModified };

              if (lastModified && (!mostRecent || lastModified > mostRecent)) {
                mostRecent = lastModified;
              }
            } else {
              results[file.name] = { size: null, lastModified: null };
            }
          } catch {
            results[file.name] = { size: null, lastModified: null };
          }
        }),
      );

      setMetadata(results);
      setLatestUpdate(mostRecent);
    };

    fetchMetadata();
  }, []);

  return (
    <main className={styles.llmsPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">LLM Documentation</h1>
          <p className={styles.subtitle}>
            Machine-readable API documentation optimized for AI assistants. Use this file to give Claude, ChatGPT,
            Cursor, or other AI tools accurate knowledge about PixiJS.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          {files.map((file) => {
            const meta = metadata[file.name];
            const Icon = file.icon;

            return (
              <Card key={file.name} className={styles.fileCard}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <div className={styles.fileNameRow}>
                      <Icon className={styles.fileIcon} />
                      <CardTitle className={styles.fileName}>{file.name}</CardTitle>
                    </div>
                    {meta?.size && <span className={styles.fileSize}>{formatFileSize(meta.size)}</span>}
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
                    <a href={file.path} download className={styles.downloadButton}>
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
        {latestUpdate && <p className={styles.updatedTimestamp}>Updated: {formatDate(latestUpdate)}</p>}
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
            const Logo = ide.logo;

            return (
              <div key={ide.name} className={styles.ideCard}>
                <div className={styles.ideCardHeader}>
                  <Logo className={styles.ideLogo} />
                  <h3 className={styles.ideCardTitle}>{ide.name}</h3>
                </div>

                {ide.sections.map((section, sectionIndex) => {
                  const sectionId = `${ide.name}-${sectionIndex}`;

                  return (
                    <div key={sectionId} className={styles.ideCardSection}>
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
                          <button
                            className={`${styles.copyButton} ${copiedId === sectionId ? styles.copied : ''}`}
                            onClick={() => handleCopy(sectionId, section.code!)}
                            aria-label="Copy code"
                          >
                            {copiedId === sectionId ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <a href={ide.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.docsLink}>
                  <ExternalLink size={14} />
                  Learn more
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default LLMsPage;
