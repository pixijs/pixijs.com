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

export const useRowClassNameModifier = (modifier: string, isActive = true) => {
  useEffect(() => {
    const row = document.querySelector<HTMLDivElement>('.container > .row');

    if (row === null || !isActive) {
      return;
    }

    row.classList.add(modifier);

    return () => {
      row.classList.remove(modifier);
    };
  }, [modifier, isActive]);
};

export const useClassModifier = (selector: string, modifier: string, isActive = true) => {
  useEffect(() => {
    const element = document.querySelector<HTMLDivElement>(selector);

    if (element === null || !isActive) {
      return;
    }

    element.classList.add(modifier);

    return () => {
      element.classList.remove(modifier);
    };
  }, [selector, modifier, isActive]);
};
