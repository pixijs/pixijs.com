import { useCallback, useState, type FormEvent } from 'react';

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const FALLBACK_ERROR = 'Something went wrong. Try again.';

export function useFormSubmission(submit: (form: HTMLFormElement) => Promise<void>) {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;

      setStatus('submitting');
      setError('');

      try {
        await submit(form);
        setStatus('success');
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : FALLBACK_ERROR);
        setStatus('error');
      }
    },
    [submit],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
  }, []);

  return { status, error, handleSubmit, reset };
}
