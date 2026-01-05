import { Sparkles, Download, ExternalLink, FileText, BookOpen, Code } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from './LLMs.module.scss';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/Sponsor/card/Card';

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
          <div className={styles.titleRow}>
            <Sparkles className={styles.sparklesIcon} />
            <h1 className="underline">LLM Documentation</h1>
          </div>
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

            return (
              <Card key={file.name} className={styles.fileCard}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardTitleRow}>
                    <CardTitle className={styles.fileName}>{file.name}</CardTitle>
                    {meta?.size && <span className={styles.fileSize}>{formatFileSize(meta.size)}</span>}
                  </div>
                  <CardDescription>{file.description}</CardDescription>
                </CardHeader>
                <CardContent className={styles.cardContent}>
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
      </section>

      {/* What is llms.txt Section */}
      <section className={styles.explainerSection}>
        <h2>What is llms.txt?</h2>
        <p className={styles.explainerText}>
          <code className={styles.inlineCode}>llms.txt</code> is a{' '}
          <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className={styles.standardLink}>
            standardized format
          </a>{' '}
          (similar to <code className={styles.inlineCode}>robots.txt</code>) that provides AI assistants with structured
          documentation about a project.
        </p>

        <div className={styles.fileComparison}>
          {files.map((file) => {
            const Icon = file.icon;

            return (
              <div key={file.name} className={styles.fileRow}>
                <div className={styles.fileRowHeader}>
                  <Icon className={styles.fileRowIcon} />
                  <span className={styles.fileRowName}>{file.name}</span>
                </div>
                <p className={styles.fileRowDescription}>{file.detailedDescription}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default LLMsPage;
