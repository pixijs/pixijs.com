import type { AnchorHTMLAttributes, MouseEvent } from 'react';

interface StepLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  step: number;
  onGo: (step: number) => void;
}

/**
 * A plain `#N` link: Docusaurus's `Link` would report `#N` as a broken anchor, since no element carries that id.
 * A plain click goes through `onGo`; modified clicks keep the browser's behaviour.
 */
export default function StepLink({ step, onGo, onClick, ...rest }: StepLinkProps) {
  const go = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    onGo(step);
  };

  return <a href={`#${step}`} onClick={go} {...rest} />;
}
