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
  "Still not done? Cool. It'll be just as undone tomorrow too",
  "You're not busy. You're avoiding it. There's a difference",
  'The version of you that skips this is not the version you want to be. Your call',
  "You've already decided this matters. Everything else is just noise",
  "You know exactly what you need to do. You've known all day",
  '"Not today" is how "never" starts',
  'Nobody is coming to make you do this. That was always the deal',
  "Your future self is watching. They're not impressed yet",
  "The resistance you feel right now? That's exactly why you have to do it",
  "You don't negotiate with a nonnegotiable. That's the whole point",
  "Skipping it feels like relief. For about an hour. Then you know",
  "Every version of success you've imagined required doing this. Funny how that works",
  "You made a promise to yourself. Those are the ones that actually count",
  "The hard part isn't the work. It's deciding you're worth showing up for",
  "Do it badly. Do it tired. Do it anyway",
  "You're not going to feel like it. That was never part of the deal",
  "The list of things more important than this is shorter than you're pretending",
  "You'll feel better after. You already know this. So what are you waiting for?",
  "Comfort now, regret later. Or discomfort now, progress later. Pick one",
  "You've been meaning to. Meaning to isn't doing it",
  "The gap between who you are and who you want to be is made of days like this",
  "This is the part where most people quit. Which is exactly why you shouldn't",
  "Stop waiting for the right moment. You're manufacturing delay",
  "You have time. You're just not using it on this",
  "It doesn't have to be good. It has to be done",
]

const SKIP_QUOTES = [
  "Still time. But you already know that, which is why this is annoying",
  "You skipped it this morning. Fine. But not twice",
  "The day isn't over. That's either an excuse or an opportunity — pick one",
  "You're reading this instead of doing it. Interesting choice",
  "Yesterday you said tomorrow. Today you said later. What's the plan exactly?",
  "Two in a row becomes a new default. Don't let that be the one you pick",
  "The longer you wait, the more it costs you. It's already been too long",
  "This notification exists because you asked for accountability. Here it is",
  "You're going to think about this whether you do it or not. Might as well do it",
  "Still hasn't happened on its own. Weird how that keeps not working",
  "Every hour you wait makes it easier to skip tomorrow too",
  "You set this reminder. You knew you'd need it. Use it",
  "The version of you from this morning said they'd do it later. It's later",
  "You're closer to the end of the day than the beginning. Just saying",
  "Saving it for tonight is still a choice. Make sure it's actually a plan",
  "The regret of not doing it outlasts the effort of doing it. Every time",
  "You can explain it away or you can just do it. One of those actually helps",
  "Not done yet. That's fine. But done by tonight is not optional",
  "Tomorrow's version of you will wish today's version had handled this",
]

const SUNDAY_TITLES = [
  'Seven days. Be honest about how many actually counted',
  'Weekly reset. No spin, no excuses — just truth',
  "The week is closed. Did you show up for the person you said you were becoming?",
  'Time to account for the week. Not to a boss — to yourself',
  'What story are you telling yourself about this week? Is it true?',
  "You had 7 chances. How'd you use them?",
  'Sunday. The week is evidence. What does yours say?',
  "Another week is done. The question is whether you can look at it straight",
  "Weekly check-in. Not to feel good — to get better",
  "The week doesn't lie. How honest are you willing to be about it?",
  "Seven days just passed. What do you have to show for them?",
  "You set a goal. A week happened. Those two things need to talk",
  "This is the part where you either learn from the week or repeat it",
  "Sunday reset. The only question that matters: what actually got in the way?",
  "The week is scored. Time to review the tape",
  "You know how the week went. This is just the part where you admit it",
  "Reset time. Not to punish yourself — to make next week different",
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

  const [hours, minutes] = parseTime(
    n.executionRule?.notificationTime ?? n.notificationTime ?? '09:00',
  )

  const dailyEnabled = n.dailyReminderEnabled !== false

  if (dailyEnabled) {
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
  }

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
      body: `${pick(DAILY_QUOTES)}\nGoal: ${n.why}`,
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
