import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Nonnegotiable } from '../types';
import {
  loadNonnegotiable,
  saveNonnegotiable,
  clearNonnegotiable,
  loadCheckIns,
  saveCheckIns,
} from './storage';
import { todayKey } from './date';

type AppContextValue = {
  ready: boolean;
  nonnegotiable: Nonnegotiable | null;
  checkIns: Record<string, boolean>;
  setNonnegotiable: (n: Nonnegotiable) => Promise<void>;
  resetAll: () => Promise<void>;
  toggleToday: () => Promise<void>;
  isCheckedToday: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [nonnegotiable, setNonnegotiableState] = useState<Nonnegotiable | null>(null);
  const [checkIns, setCheckInsState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const [n, c] = await Promise.all([loadNonnegotiable(), loadCheckIns()]);
      setNonnegotiableState(n);
      setCheckInsState(c);
      setReady(true);
    })();
  }, []);

  const setNonnegotiable = useCallback(async (n: Nonnegotiable) => {
    await saveNonnegotiable(n);
    setNonnegotiableState(n);
  }, []);

  const resetAll = useCallback(async () => {
    await clearNonnegotiable();
    setNonnegotiableState(null);
    setCheckInsState({});
  }, []);

  const toggleToday = useCallback(async () => {
    const key = todayKey();
    const next = { ...checkIns, [key]: !checkIns[key] };
    if (!next[key]) delete next[key];
    setCheckInsState(next);
    await saveCheckIns(next);
  }, [checkIns]);

  const isCheckedToday = !!checkIns[todayKey()];

  return (
    <AppContext.Provider
      value={{
        ready,
        nonnegotiable,
        checkIns,
        setNonnegotiable,
        resetAll,
        toggleToday,
        isCheckedToday,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
