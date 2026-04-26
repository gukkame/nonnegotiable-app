import { useState } from 'react'
import { useApp } from './AppContext'
import { daysAgoKey, getWeekKeys } from './date'
import { NoticeType } from '../types/notices'

export { NoticeType }

export function useNotice() {
  const { ready, nonnegotiable, checkIns, todayValue, weeklyResetDone } = useApp()
  const [dismissed, setDismissed] = useState(false)

  const yesterday = daysAgoKey(1)
  const isSunday  = new Date().getDay() === 0

  const createdAt = nonnegotiable ? new Date(nonnegotiable.createdAt) : null
  const dayOld    = createdAt ? Date.now() - createdAt.getTime() > 86_400_000 : false

  let notice: NoticeType | null = null

  if (!dismissed && ready && nonnegotiable) {
    if (isSunday && !weeklyResetDone) {
      notice = NoticeType.Sunday
    } else if (dayOld && checkIns[yesterday] !== 'yes' && !todayValue) {
      notice = NoticeType.Skip
    } else if (!todayValue) {
      notice = NoticeType.Daily
    }
  }

  const completedThisWeek = getWeekKeys().filter((k) => checkIns[k] === 'yes').length

  return {
    notice,
    dismiss: () => setDismissed(true),
    completedThisWeek,
  }
}
