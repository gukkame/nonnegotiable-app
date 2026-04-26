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
    id: 'no_start',
    label: "I didn't start",
    fixes: [
      { id: 'morning', label: 'Attach to a morning habit', trigger: 'After morning coffee', constraint: 'phone stays down',      duration: '10 min' },
      { id: 'alarm',   label: 'Set a hard start time',     trigger: 'At 7:00 AM alarm',     constraint: 'alarm as trigger',      duration: '15 min' },
      { id: 'first',   label: 'Make it your first task',   trigger: 'When you wake up',     constraint: 'before checking phone', duration: '5 min'  },
    ],
  },
  {
    id: 'no_idea',
    label: "I didn't know what to do",
    fixes: [
      { id: 'pre_decide', label: 'Pre-decide the next step tonight', trigger: 'Tonight before sleep', constraint: 'write one sentence', duration: '5 min'  },
      { id: 'open_notes', label: 'Open notes before starting',       trigger: 'When you sit down',    constraint: 'notes open first',   duration: '20 min' },
    ],
  },
  {
    id: 'tired',
    label: 'I was too tired',
    fixes: [
      { id: 'peak',    label: 'Move to your peak energy window', trigger: 'After breakfast',      constraint: 'coffee in hand',  duration: '10 min' },
      { id: 'shorten', label: 'Shorten the session to 5 min',   trigger: 'When you have energy', constraint: 'no multitasking', duration: '5 min'  },
      { id: 'nap',     label: 'Nap first, then start',          trigger: 'After a 20-min nap',   constraint: 'alarm set',       duration: '10 min' },
    ],
  },
  {
    id: 'distracted',
    label: 'I got distracted',
    fixes: [
      { id: 'phone_away',  label: 'Phone in another room',   trigger: 'At your desk', constraint: 'phone in another room', duration: '25 min' },
      { id: 'focus_block', label: 'Use a timed focus block', trigger: 'After lunch',  constraint: 'Do Not Disturb on',     duration: '15 min' },
    ],
  },
  {
    id: 'forgot',
    label: 'I forgot',
    fixes: [
      { id: 'daily_alarm', label: 'Set a daily alarm',           trigger: 'At 6:00 PM alarm',       constraint: "stop what you're doing", duration: '10 min' },
      { id: 'routine',     label: 'Link to an existing routine', trigger: 'After brushing teeth',   constraint: 'no skipping',            duration: '10 min' },
      { id: 'visual',      label: 'Add a visual cue',            trigger: 'When you see your note', constraint: 'act immediately',        duration: '10 min' },
    ],
  },
]
