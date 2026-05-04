export type ExecutionRule = {
  trigger: string;
  constraint: string;
  action: string;
  duration: string;
  notificationTime?: string; // HH:MM when the trigger notification fires
};

export type Nonnegotiable = {
  projectName: string;
  action: string;
  bareMinimum?: string; // smallest possible step shown on the friction screen
  why: string;
  createdAt: string; // ISO date string
  notificationTime?: string; // HH:MM in 24h format, e.g. "09:00"
  dailyReminderEnabled?: boolean; // defaults to true
  weeklyAdjustment?: string; // fix label from last weekly reset
  executionRule?: ExecutionRule; // structured rule from last weekly reset
};

// Each day maps to 'yes' | 'no' — or undefined if not recorded
export type CheckInValue = 'yes' | 'no';

export type CheckIns = Record<string, CheckInValue>;

export type AppState = {
  nonnegotiable: Nonnegotiable | null;
  checkIns: CheckIns;
};
