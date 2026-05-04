export type Fix = {
  id: string
  label: string
  trigger: string
  constraint: string
  duration: string
}

export type ResistanceType = {
  id: string
  label: string
  fixes: Fix[]
}

export const RESISTANCE: ResistanceType[] = [
  {
    id: 'overwhelmed',
    label: "It felt too big to start",
    fixes: [
      {
        id: 'two_min',
        label: 'Shrink it to 2 minutes — timer stops you',
        trigger: 'When you sit down',
        constraint: 'set a timer — you must stop at 2 min',
        duration: '2 min',
      },
      {
        id: 'just_open',
        label: 'Commit to only opening the file',
        trigger: 'First thing after waking up',
        constraint: 'open it — you\'re allowed to close it after',
        duration: '1 min',
      },
      {
        id: 'pre_decide',
        label: 'Decide the single next action tonight',
        trigger: 'Tonight before bed',
        constraint: 'write one sentence: "Tomorrow I will..."',
        duration: '5 min',
      },
    ],
  },
  {
    id: 'no_time',
    label: "I ran out of time",
    fixes: [
      {
        id: 'earlier',
        label: 'Move it before the day can steal it',
        trigger: 'Before checking messages or news',
        constraint: 'phone face down until done',
        duration: '15 min',
      },
      {
        id: 'minimum_version',
        label: 'Define a minimum version for busy days',
        trigger: 'When the full session isn\'t possible',
        constraint: 'minimum version only — still counts as done',
        duration: '10 min',
      },
      {
        id: 'schedule_slot',
        label: 'Book it in your calendar like a meeting',
        trigger: 'Tonight, before you close your laptop',
        constraint: 'pick a specific slot — treat it as unmovable',
        duration: '5 min',
      },
    ],
  },
  {
    id: 'tired',
    label: "I had no energy for it",
    fixes: [
      {
        id: 'peak_window',
        label: 'Move it to your highest-energy window',
        trigger: 'After breakfast',
        constraint: 'before email, social, or other demands',
        duration: '20 min',
      },
      {
        id: 'start_anyway',
        label: 'Start anyway — 5 minutes, no excuses',
        trigger: 'When the tiredness kicks in',
        constraint: 'timer on — action first, feelings later',
        duration: '5 min',
      },
      {
        id: 'morning_shift',
        label: 'Permanently shift it to mornings',
        trigger: 'Right after waking up',
        constraint: 'before phone, coffee, or anything else',
        duration: '15 min',
      },
    ],
  },
  {
    id: 'distracted',
    label: "I kept getting distracted",
    fixes: [
      {
        id: 'phone_away',
        label: 'Phone in a different room',
        trigger: 'When you sit down to work',
        constraint: 'phone out of reach — not on silent, out of the room',
        duration: '25 min',
      },
      {
        id: 'pomodoro',
        label: 'Use a 25-minute focus timer',
        trigger: 'Start a countdown before opening anything',
        constraint: 'nothing else counts until the timer rings',
        duration: '25 min',
      },
      {
        id: 'announce',
        label: 'Tell someone you\'re starting right now',
        trigger: 'Before you open the task',
        constraint: 'text one person "starting now" — creates accountability',
        duration: '25 min',
      },
    ],
  },
  {
    id: 'procrastinating',
    label: "I kept putting it off",
    fixes: [
      {
        id: 'habit_anchor',
        label: 'Lock it directly after a habit you never skip',
        trigger: 'Immediately after [coffee / brushing teeth / lunch]',
        constraint: 'zero gap — no transition time allowed',
        duration: '15 min',
      },
      {
        id: 'temptation_bundle',
        label: 'Pair it with something you enjoy',
        trigger: 'With your morning coffee or tea',
        constraint: 'only allowed during this habit — starts it, ends it',
        duration: '15 min',
      },
      {
        id: 'if_then',
        label: 'Write a specific if–then plan',
        trigger: 'Tonight before bed',
        constraint: 'write: "If [situation], then I will [action]"',
        duration: '5 min',
      },
    ],
  },
  {
    id: 'forgot',
    label: "I ignored notifications or just forgot",
    fixes: [
      {
        id: 'hard_alarm',
        label: 'One daily alarm — no snooze rule',
        trigger: 'At alarm — stop what you\'re doing',
        constraint: 'no snooze, no "I\'ll do it in a minute"',
        duration: '15 min',
      },
      {
        id: 'habit_stack',
        label: 'Stack it onto something you do every day',
        trigger: 'Right after [morning routine / meal / commute]',
        constraint: 'same cue, same sequence, every day',
        duration: '10 min',
      },
      {
        id: 'visual_cue',
        label: 'Put a physical object where you can\'t miss it',
        trigger: 'When you see the object or note',
        constraint: 'act immediately — don\'t move it without doing the task',
        duration: '10 min',
      },
    ],
  },
]
