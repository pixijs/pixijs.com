import stylesheet from '!!raw-loader!sass-loader!./styles.scss';
import OriginalSearchPage from '@theme-original/SearchPage';
import { useEffect } from 'react';

/**
 * The search plugin's results page, with a name for its unlabelled scope select. Its styles are inlined here, so they
 * stay out of every other page's CSS.
 */
export default function SearchPage() {
  useEffect(() => {
    document.getElementById('context-selector')?.setAttribute('aria-label', 'Search in');
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      <OriginalSearchPage />
    </>
  );
}
