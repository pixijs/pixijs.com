import { memo, useEffect, useState } from 'react';
import styles from '../examples.module.css';
import { ExampleEditor } from '@site/src/components/Editor/ExampleEditor';

import type React from 'react';
import type { Item } from '../types';

interface MainContentProps {
  selectedItem: Item | null;
}

interface FileWithContent {
  name: string;
  content: string;
}

const MainContent: React.FC<MainContentProps> = ({ selectedItem }) => {
  const [fileContents, setFileContents] = useState<FileWithContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFileContents() {
      if (!selectedItem?.files) {
        setFileContents([]);

        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contents = await Promise.all(
          selectedItem.files.map(async (file) => {
            const response = await fetch(`/examples/source/${file.location}`);

            if (!response.ok) {
              throw new Error(`Failed to fetch ${file.location}`);
            }
            const content = await response.text();

            return {
              name: file.name,
              content,
            };
          }),
        );

        setFileContents(contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load files');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFileContents();
  }, [selectedItem]);

  if (!selectedItem) {
    return (
      <main className={`${styles['main-content']}`}>
        <div className={`${styles['main-content__empty']}`}>
          <h1>Select an example to view its code.</h1>
        </div>
      </main>
    );
  }

  // map the file contents to be an object with the name being the key and the content being the value
  const fileMap = fileContents.reduce((acc: any, file) => {
    acc[file.name] = file.content;

    return acc;
  }, {});

  // if dependencies is an empty object, we can set it to undefined
  const dependencies = Object.keys(selectedItem.dependencies).length === 0 ? undefined : selectedItem.dependencies;

  console.log('rendering MainContent with selectedItem:', selectedItem);

  return (
    <main className={`${styles['main-content']}`}>
      {/* <header className={`${styles['main-content__header']}`}>
          <button className={`${styles['main-content__menu-toggle']}`} onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <Menu size={24} />
          </button>
        </header> */}
      <div className={`${styles['main-content__editor']}`}>
        {isLoading && <div>Loading files...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!isLoading && !error && <ExampleEditor height="calc(100%)" dependencies={dependencies} files={fileMap} />}
      </div>
    </main>
  );
};

export default memo(MainContent);
