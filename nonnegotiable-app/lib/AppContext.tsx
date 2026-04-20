import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import type { Nonnegotiable, CheckIns, CheckInValue } from '../types';
import {
  loadNonnegotiable, saveNonnegotiable, clearNonnegotiable,
  loadCheckIns, saveCheckIns,
} from './storage';
import { todayKey } from './date';

type AppContextValue = {
  ready:            boolean;
  nonnegotiable:    Nonnegotiable | null;
  checkIns:         CheckIns;
  todayValue:       CheckInValue | undefined;
  setNonnegotiable: (n: Nonnegotiable) => Promise<void>;
  markToday:        (val: CheckInValue) => Promise<void>;
  resetAll:         () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady]                     = useState(false);
  const [nonnegotiable, setNonnegotiableState]= useState<Nonnegotiable | null>(null);
  const [checkIns, setCheckInsState]          = useState<CheckIns>({});

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

  /**
   * Mark today as 'yes' or 'no'.
   * Calling with the same value a second time clears the entry (toggle off).
   */
  const markToday = useCallback(async (val: CheckInValue) => {
    const key = todayKey();
    const current = checkIns[key];
    const next: CheckIns = { ...checkIns };
    if (current === val) {
      delete next[key]; // tap same button again → unmark
    } else {
      next[key] = val;
    }
    setCheckInsState(next);
    await saveCheckIns(next);
  }, [checkIns]);

  const resetAll = useCallback(async () => {
    await clearNonnegotiable();
    setNonnegotiableState(null);
    setCheckInsState({});
  }, []);

  const todayValue = checkIns[todayKey()];

  return (
    <AppContext.Provider value={{
      ready, nonnegotiable, checkIns, todayValue,
      setNonnegotiable, markToday, resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
