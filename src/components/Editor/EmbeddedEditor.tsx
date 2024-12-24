import { type EditorProps, Editor } from './Editor';

export function EmbeddedEditor(props: EditorProps)
{
    return <Editor height={400} showCode={false} fullSizePreview={true} {...props} />;
}
