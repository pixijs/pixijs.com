import LazyEditor from './LazyEditor';

import type { EditorProps } from './Editor';

export function ExampleEditor(props: EditorProps) {
  return <LazyEditor height="calc(100vh - 325px)" {...props} />;
}
