import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../lib/colors'
import { Borders } from '../lib/theme'
import { getWeekKeys } from '../lib/date'
import type { CheckIns } from '../types'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

type Props = {
  checkIns: CheckIns
  size?: number
}

export function WeekStrip({ checkIns, size = 30 }: Props) {
  const weekKeys = getWeekKeys()
  const today    = new Date().getDay()
  const todayIdx = today === 0 ? 6 : today - 1

  return (
    <View style={s.row}>
      {DAY_LABELS.map((d, i) => {
        const val     = checkIns[weekKeys[i]]
        const isToday = i === todayIdx

        const dotStyle = [
          { width: size, height: size, borderRadius: size / 2 },
          s.dot,
          val === 'yes' && { backgroundColor: Colors.success, borderColor: 'transparent' },
          val === 'no'  && { borderColor: Colors.failure + '55' },
          isToday && !val && { borderColor: Colors.accent + '80' },
        ]

        return (
          <View key={i} style={s.col}>
            <Text style={[s.label, isToday && { color: Colors.primary }]}>{d}</Text>
            <View style={dotStyle}>
              {val === 'yes' && <Text style={s.checkText}>✓</Text>}
              {val === 'no'  && <Text style={s.crossText}>✕</Text>}
            </View>
          </View>
        )
      })}
    </View>
  )
}

const s = StyleSheet.create({
  row:        { flexDirection: 'row', gap: 8 },
  col:        { flex: 1, alignItems: 'center', gap: 5 },
  label:      { fontSize: 11, color: Colors.secondary },
  dot:        { borderWidth: 1, borderColor: Borders.faint, alignItems: 'center', justifyContent: 'center' },
  checkText:  { color: '#fff', fontSize: 11, fontWeight: '700' },
  crossText:  { color: Colors.failure, fontSize: 11 },
})
