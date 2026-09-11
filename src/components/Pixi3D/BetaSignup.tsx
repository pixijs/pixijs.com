import { useCallback, useRef, useState, type FocusEvent } from 'react';
import clsx from 'clsx';
import { AlertCircle, ArrowUpRight, Rocket } from 'lucide-react';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { submitToKit } from '../../utils/formSubmission';
import KitGuard from './KitGuard';
import styles from './BetaSignup.module.css';

// Field names come from the form's Kit embed and must match exactly:
// https://app.kit.com/forms/9900665/subscriptions
const KIT_FORM_ID = '9900665';

// GitHub's own rules: alphanumerics and hyphens, no leading, trailing or
// consecutive hyphens, 39 characters maximum.
const GITHUB_USERNAME = '[A-Za-z\\d](?:[A-Za-z\\d]|-(?=[A-Za-z\\d])){0,38}';

const EXPERIENCE_OPTIONS = ['Less than a year', '1–2 years', '3–4 years', '5+ years'];

function normalizeGithubInput(input: HTMLInputElement) {
  input.value = input.value
    .trim()
    .replace(/^@/, '')
    .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')
    .replace(/\/.*$/, '');

  return input.value;
}

// The form replaces itself on success, which would otherwise drop focus to the body.
const focusOnMount = (element: HTMLElement | null) => element?.focus();

export default function BetaSignup() {
  const [guardUrl, setGuardUrl] = useState('');
  const clearGuard = useCallback(() => setGuardUrl(''), []);
  const submit = useCallback(async (form: HTMLFormElement) => {
    const result = await submitToKit(KIT_FORM_ID, form);

    setGuardUrl(result.guardUrl ?? '');
  }, []);
  const { status, error, handleSubmit } = useFormSubmission(submit);
  const [githubWarning, setGithubWarning] = useState('');
  const checkedUsername = useRef('');

  // A failed lookup must never block a sign-up, so only a definitive 404
  // warns. Rate limiting, offline and GitHub outages all stay silent.
  const handleGithubBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const username = normalizeGithubInput(input);

    if (username === checkedUsername.current) return;

    checkedUsername.current = username;
    setGithubWarning('');

    if (!input.checkValidity()) return;

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (checkedUsername.current === username && response.status === 404) {
        setGithubWarning(`We couldn’t find “${username}” on GitHub. Double-check it before you submit.`);
      }
    } catch {
      // Silent by design; see above.
    }
  };

  if (status === 'success' && guardUrl) {
    return (
      <div className={styles.success}>
        <h2 ref={focusOnMount} tabIndex={-1}>
          One more step.
        </h2>
        <p>Confirm you’re human to finish signing up.</p>
        <KitGuard url={guardUrl} onConfirmed={clearGuard} />
        <small>
          Not loading?{' '}
          <a href={guardUrl} target="_blank" rel="noreferrer">
            Open the check in a new tab
          </a>
          .
        </small>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <Rocket size={34} strokeWidth={1.5} aria-hidden="true" />
        <h2 ref={focusOnMount} tabIndex={-1}>
          You’re signed up.
        </h2>
        <p>We review sign-ups in batches. When you’re in, you’ll get an invite to the beta repo on GitHub.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.requiredNote}>Fields marked * are required.</p>

      <div className={styles.field}>
        <label htmlFor="beta-email">Email *</label>
        <input
          id="beta-email"
          name="email_address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="beta-github">GitHub username *</label>
        <input
          id="beta-github"
          name="fields[github_account]"
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="octocat"
          pattern={GITHUB_USERNAME}
          title="Letters, numbers and single hyphens, up to 39 characters."
          required
          aria-describedby={clsx('beta-github-hint', githubWarning && 'beta-github-warning')}
          onBlur={handleGithubBlur}
          // Enter submits without a blur, and the pattern would reject a pasted profile URL.
          onKeyDown={(event) => event.key === 'Enter' && normalizeGithubInput(event.currentTarget)}
        />
        <small id="beta-github-hint">Used to send your beta repo invite.</small>
        {githubWarning && (
          <p id="beta-github-warning" className={styles.warning} role="status">
            {githubWarning}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="beta-company">
          Company <span>Optional</span>
        </label>
        <input
          id="beta-company"
          name="fields[company]"
          type="text"
          autoComplete="organization"
          placeholder="Who do you work with?"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="beta-experience">
          PixiJS experience <span>Optional</span>
        </label>
        <select id="beta-experience" name="fields[pixijs_experience]" defaultValue="">
          <option value="">Prefer not to say</option>
          {EXPERIENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {status === 'error' && (
        <p className={styles.error} role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitButton} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit'}
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
