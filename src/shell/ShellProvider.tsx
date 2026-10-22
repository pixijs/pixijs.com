import { useLocation } from '@docusaurus/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

/** Who renders the rail: `Layout` itself, or `DocRoot/Layout` (which has the doc tree) on docs routes */
export type RailOwner = 'layout' | 'docs';
export type RailPanel = 'root' | 'section';

interface ShellState {
  railOwner: RailOwner;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  panel: RailPanel;
  setPanel: Dispatch<SetStateAction<RailPanel>>;
  searchOpen: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
}

const ShellContext = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const shell = useContext(ShellContext);

  if (!shell) throw new Error('useShell() is only available inside <Layout>');

  return shell;
}

export const useRailOwner = (): RailOwner | undefined => useContext(ShellContext)?.railOwner;

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/** ⌘K / Ctrl K anywhere and `/` outside fields open search; Monaco keeps its own ⌘K chords */
function useSearchShortcut(setSearchOpen: Dispatch<SetStateAction<boolean>>) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const modK = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k';
      const slash = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping(target);

      if ((!modK && !slash) || target?.closest?.('.monaco-editor')) return;
      event.preventDefault();
      setSearchOpen((open) => (modK ? !open : true));
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen]);
}

export default function ShellProvider({ railOwner, children }: { railOwner: RailOwner; children: ReactNode }) {
  const { key } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panel, setPanel] = useState<RailPanel>('section');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
    setPanel('section');
    setSearchOpen(false);
  }, [key]);

  useSearchShortcut(setSearchOpen);

  const value = useMemo(
    () => ({ railOwner, drawerOpen, setDrawerOpen, panel, setPanel, searchOpen, setSearchOpen }),
    [railOwner, drawerOpen, panel, searchOpen],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
