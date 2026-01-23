import { ExternalLink } from 'lucide-react';
import type React from 'react';
import styles from './BugBounty.module.scss';
import { useClassModifier } from '@site/src/hooks/useContainerClassNameModifier';

const terms = [
  'Only issues pre-approved with a bounty tag and dollar amount are eligible.',
  "Bounties are awarded at the PixiJS team's discretion. We reserve the right to reject fixes that are incomplete, introduce regressions, or do not meet project standards.",
  'You may submit fixes for issues without a bounty tag, but they will not be eligible for financial rewards.',
  'Multiple contributors can submit PRs for the same bounty, but only the PR that gets merged is eligible for payment.',
  'The bounty amount is fixed and non-negotiable.',
  'Abuse, spamming, or low-quality submissions may result in exclusion from the program.',
];

interface Step {
  title: string;
  description: React.ReactNode;
}

export default function BugBountyPage(): React.JSX.Element {
  useClassModifier('.main-wrapper', 'tileBackground', true);

  const steps: Step[] = [
    {
      title: 'Bounty Tag Assignment',
      description: (
        <>
          The PixiJS team identifies eligible issues and applies the <strong>bounty</strong> label along with a specific
          dollar amount. Only issues labeled with the bounty tag and a dollar amount are eligible for this program.
        </>
      ),
    },
    {
      title: 'Submission Requirements',
      description: (
        <>
          Submit a Pull Request that fixes the issue, link the issue in your PR description, include a clear example or
          test case demonstrating the fix, and follow our{' '}
          <a
            href="https://github.com/pixijs/pixijs/blob/dev/.github/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.standardLink}
          >
            contribution guidelines
          </a>
          .
        </>
      ),
    },
    {
      title: 'Approval Process',
      description: (
        <>
          The PixiJS team will review your PR. If your fix is accepted and merged into the main branch, your bounty is
          approved.
        </>
      ),
    },
    {
      title: 'Requesting Payment',
      description: (
        <>
          Once merged, submit a payout request via our{' '}
          <a
            href="https://opencollective.com/pixijs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.standardLink}
          >
            Open Collective
          </a>{' '}
          page. Include a link to the merged PR and the bounty issue in your request.
        </>
      ),
    },
  ];

  return (
    <main className={styles.bugBountyPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">Bug Bounty Program</h1>
          <p className={styles.subtitle}>
            PixiJS is committed to delivering a reliable, high-performance rendering engine. Our Bug Bounty Program
            rewards contributors who help make PixiJS more stable and robust.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.stepsSection}>
        <h2>How It Works</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.stepCard}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>{index + 1}</span>
                {step.title}
              </h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms Section */}
      <section className={styles.termsSection}>
        <h2>Terms & Conditions</h2>
        <div className={styles.termsCard}>
          <ul className={styles.termsList}>
            {terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sponsoring Bounties Section */}
      <section className={styles.sponsoringSection}>
        <h2>Sponsoring Bounties</h2>
        <div className={styles.sponsoringCard}>
          <p>
            If you are a developer or company working on a project and would like to sponsor a one-off bounty, please
            contact <strong>Matt Karl</strong>{' '}
            <a
              href="https://github.com/bigtimebuddy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.standardLink}
            >
              @bigtimebuddy
            </a>{' '}
            at{' '}
            <a href="mailto:hello@mattkarl.com" className={styles.standardLink}>
              hello@mattkarl.com
            </a>{' '}
            to arrange the details.
          </p>
          <p>
            Sponsors can make one-time donations directly to our{' '}
            <a
              href="https://opencollective.com/pixijs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.standardLink}
            >
              Open Collective
            </a>{' '}
            to fund the bounty. We kindly request that sponsors add an additional <strong>10%</strong> to the bounty
            amount to cover Open Collective&apos;s processing fees.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaDescription}>Find eligible bounty issues and start contributing today.</p>

          <a
            href="https://github.com/pixijs/pixijs/issues?q=is%3Aissue%20state%3Aopen%20label%3A%F0%9F%92%B0Bounty"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buttonPrimary}
          >
            <ExternalLink className={styles.buttonIcon} />
            Find Bounty Issues
          </a>

          <p className={styles.ctaFooter}>
            Questions? Ask on our{' '}
            <a
              href="https://github.com/pixijs/pixijs/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.standardLink}
            >
              GitHub Discussions
            </a>{' '}
            or{' '}
            <a
              href="https://discord.gg/QrnxmQUPGV"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.standardLink}
            >
              Discord
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
