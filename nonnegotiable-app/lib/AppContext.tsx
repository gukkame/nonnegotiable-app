import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import type { Nonnegotiable, CheckIns, CheckInValue, ExecutionRule } from '../types';
import {
  loadNonnegotiable, saveNonnegotiable, clearNonnegotiable,
  loadCheckIns, saveCheckIns,
  loadWeeklyResetWeek, saveWeeklyResetWeek, clearWeeklyResetWeek,
} from './storage';
import { scheduleGoalNotifications, cancelAllNotifications } from './notifications';
import { todayKey, getWeekKeys } from './date';

type AppContextValue = {
  ready:               boolean;
  nonnegotiable:       Nonnegotiable | null;
  checkIns:            CheckIns;
  todayValue:          CheckInValue | undefined;
  weeklyResetDone:     boolean;
  setNonnegotiable:    (n: Nonnegotiable) => Promise<void>;
  markToday:           (val: CheckInValue) => Promise<void>;
  submitWeeklyReset:   (adjustment: string | null, rule?: ExecutionRule) => Promise<void>;
  resetAll:            () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady]                      = useState(false);
  const [nonnegotiable, setNonnegotiableState] = useState<Nonnegotiable | null>(null);
  const [checkIns, setCheckInsState]           = useState<CheckIns>({});
  const [weeklyResetWeek, setWeeklyResetWeek]  = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [n, c, w] = await Promise.all([
        loadNonnegotiable(),
        loadCheckIns(),
        loadWeeklyResetWeek(),
      ]);
      setNonnegotiableState(n);
      setCheckInsState(c);
      setWeeklyResetWeek(w);
      setReady(true);
    })();
  }, []);

  const setNonnegotiable = useCallback(async (n: Nonnegotiable) => {
    await saveNonnegotiable(n);
    setNonnegotiableState(n);
    scheduleGoalNotifications(n).catch(() => {});
  }, []);

  const markToday = useCallback(async (val: CheckInValue) => {
    const key = todayKey();
    const current = checkIns[key];
    const next: CheckIns = { ...checkIns };
    if (current === val) {
      delete next[key];
    } else {
      next[key] = val;
    }
    setCheckInsState(next);
    await saveCheckIns(next);
  }, [checkIns]);

  const submitWeeklyReset = useCallback(async (adjustment: string | null, rule?: ExecutionRule) => {
    const weekKey = getWeekKeys()[0]; // Monday of current week
    await saveWeeklyResetWeek(weekKey);
    setWeeklyResetWeek(weekKey);

    if (nonnegotiable) {
      const updated: Nonnegotiable = {
        ...nonnegotiable,
        weeklyAdjustment: adjustment ?? undefined,
        executionRule: rule ?? nonnegotiable.executionRule,
      };
      await saveNonnegotiable(updated);
      setNonnegotiableState(updated);
    }
  }, [nonnegotiable]);

  const resetAll = useCallback(async () => {
    await clearNonnegotiable();
    await clearWeeklyResetWeek();
    await cancelAllNotifications();
    setNonnegotiableState(null);
    setCheckInsState({});
    setWeeklyResetWeek(null);
  }, []);

  const currentWeekKey = getWeekKeys()[0];
  console.log({ currentWeekKey, weeklyResetWeek });
  const weeklyResetDone = weeklyResetWeek === currentWeekKey;
  const todayValue = checkIns[todayKey()];

  return (
    <AppContext.Provider value={{
      ready, nonnegotiable, checkIns, todayValue,
      weeklyResetDone,
      setNonnegotiable, markToday, submitWeeklyReset, resetAll,
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
