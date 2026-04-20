export type Nonnegotiable = {
  projectName: string;
  action: string;
  why: string;
  createdAt: string; // ISO date string
};

// Each day maps to 'yes' | 'no' — or undefined if not recorded
export type CheckInValue = 'yes' | 'no';

export type CheckIns = Record<string, CheckInValue>;

export type AppState = {
  nonnegotiable: Nonnegotiable | null;
  checkIns: CheckIns;
};
