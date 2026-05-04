import * as Notifications from 'expo-notifications'
import type { Nonnegotiable } from '../types'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

const DAILY_QUOTES = [
  'You said this matters. Prove it',
  'Waiting for motivation is the oldest excuse in the book',
  "Discipline is doing it when you don't want to. Especially then",
  'Stop negotiating with yourself. You already know what to do',
  'One rep. One paragraph. One minute. Start there',
  'The hardest part ends the second you begin',
  'The gap between who you are and who you want to be closes right here',
  "You've done harder things. Do this",
  'Go',
]

const SKIP_QUOTES = [
  'Yesterday is gone. Today is still yours — if you take it',
  'You broke the streak. Start a new one',
  "One miss doesn't define you. Two in a row might. Don't let it be two",
  'The longer you wait to restart, the harder it gets. Do it now',
  'Today you get to decide if yesterday was a pause or a pattern',
]

const SUNDAY_TITLES = [
  'Time for your weekly reset',
  'The week is done. Be honest with yourself',
  'Seven chances this week. How many did you take?',
  'Accountability time — no judgment, just truth',
  "Did you show up for the person you're trying to become?",
]

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleGoalNotifications(
  n: Nonnegotiable,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()

  const granted = await requestNotificationPermission()
  if (!granted) return

  const [hours, minutes] = parseTime(n.notificationTime ?? '09:00')

  // Daily reminder at the user's chosen time
  await Notifications.scheduleNotificationAsync({
    content: {
      title: n.action,
      body: `${pick(DAILY_QUOTES)}\n Goal: ${n.why}`,
      data: { type: 'daily' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  })

  // Skip-recovery reminder ~2 hours later (capped at 22:00)
  const skipHour = Math.min(hours + 2, 22)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${n.projectName} — still time today`,
      body: pick(SKIP_QUOTES),
      data: { type: 'skip' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: skipHour,
      minute: minutes,
    },
  })

  // Weekly Sunday reset reminder at the same time
  await Notifications.scheduleNotificationAsync({
    content: {
      title: pick(SUNDAY_TITLES),
      body: `Open the app to do your weekly reset for ${n.projectName}`,
      data: { type: 'sunday' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // 1 = Sunday in expo-notifications
      hour: hours,
      minute: minutes,
    },
  })
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

export async function sendTestNotification(n: Nonnegotiable): Promise<boolean> {
  const granted = await requestNotificationPermission()
  if (!granted) return false

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Test — ${n.action}`,
      body: `${pick(DAILY_QUOTES)}\n"${n.why}"`,
      data: { type: 'test' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      repeats: false,
    },
  })
  return true
}

function parseTime(time: string): [number, number] {
  const parts = time.split(':')
  const h = parseInt(parts[0] ?? '9', 10)
  const m = parseInt(parts[1] ?? '0', 10)
  return [
    isNaN(h) ? 9 : Math.max(0, Math.min(23, h)),
    isNaN(m) ? 0 : Math.max(0, Math.min(59, m)),
  ]
}
