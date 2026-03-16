import { useEffect, useState } from 'react';
import { EmbeddedEditor } from './EmbeddedEditor';
import examples from '@site/src/data/examples.json';

interface BlogExampleProps {
  name: string;
}

export function BlogExample({ name }: BlogExampleProps) {
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const example = examples.find((e) => e.name === name);

  useEffect(() => {
    if (!example) {
      setError(`Example "${name}" not found`);
      return;
    }

    async function fetchFiles() {
      try {
        const contents = await Promise.all(
          example!.files.map(async (file) => {
            const response = await fetch(`/examples/source/${file.location}`);
            if (!response.ok) throw new Error(`Failed to fetch ${file.location}`);
            return { name: file.name, content: await response.text() };
          }),
        );

        const fileMap: Record<string, string> = {};
        for (const file of contents) {
          fileMap[file.name] = file.content;
        }
        setFiles(fileMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load example');
      }
    }

    fetchFiles();
  }, [name, example]);

  if (error) return <div>Error: {error}</div>;
  if (!files) return null;

  const deps = example!.dependencies;
  const dependencies: Record<string, string> | undefined =
    Object.keys(deps).length > 0
      ? (Object.fromEntries(Object.entries(deps).filter(([, v]) => v != null)) as Record<string, string>)
      : undefined;

  return <EmbeddedEditor files={files} dependencies={dependencies} />;
}
