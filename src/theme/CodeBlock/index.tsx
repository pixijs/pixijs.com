import CodeBlock from '@theme-original/CodeBlock';

type CodeBlockWrapperProps = { [key: string]: any } & {
    playground?: boolean;
    usesWebWorkerLibrary?: boolean;
    children: string;
};

export default function CodeBlockWrapper({ children, ...rest }: CodeBlockWrapperProps)
{
    return <CodeBlock {...rest}>{children}</CodeBlock>;
}
