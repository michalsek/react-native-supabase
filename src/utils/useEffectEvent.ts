import React from 'react';

function createUseEffectEvent() {
  if (React.useEffectEvent) {
    return React.useEffectEvent;
  }

  return function useEffectEvent<
    T extends (...args: any[]) => any,
    P extends any[] = Parameters<T>
  >(fn: T): T {
    const ref = React.useRef<T>(fn);
    ref.current = fn;

    return React.useCallback((...args: P[]) => ref.current(...args), []) as T;
  };
}

const useEffectEvent = createUseEffectEvent();

export default useEffectEvent;
