export type Nonnegotiable = {
  projectName: string;
  action: string;
  why: string;
  createdAt: string; // ISO date
};

export type CheckInState = {
  // Map of ISO date strings (YYYY-MM-DD) -> true if checked in that day
  checkIns: Record<string, boolean>;
};

export type AppState = {
  nonnegotiable: Nonnegotiable | null;
  checkIns: Record<string, boolean>;
};
