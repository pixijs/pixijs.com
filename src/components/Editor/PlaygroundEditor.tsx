import { type EditorProps, Editor } from './Editor';
import { useContainerClassNameModifier } from '@site/src/hooks/useContainerClassNameModifier';

export function PlaygroundEditor(props: EditorProps)
{
    // hack the .container class to add a modifier
    useContainerClassNameModifier('example', true);

    return <Editor height="calc(100%)" fontSize={14} {...props} />;
}
