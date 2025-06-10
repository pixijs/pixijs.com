import { useEffect } from 'react';

export const useContainerClassNameModifier = (modifier: string, isActive = true) => {
  useEffect(() => {
    const mainContainer = document.querySelector<HTMLDivElement>('main > .container');

    if (mainContainer === null || !isActive) {
      return;
    }

    mainContainer.classList.add(modifier);

    return () => {
      mainContainer.classList.remove(modifier);
    };
  }, [modifier, isActive]);
};
