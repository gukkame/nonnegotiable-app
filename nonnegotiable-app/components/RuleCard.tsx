import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { Colors } from '../lib/colors'
import { Borders, cardSurface } from '../lib/theme'
import type { ExecutionRule } from '../types'

type Props = {
  rule: ExecutionRule
  /** Compact mode hides the action row (used on home where action is shown above). */
  compact?: boolean
  style?: StyleProp<ViewStyle>
}

function formatTime12(hhmm: string): string {
  const [hh, mm] = hhmm.split(':').map(Number)
  const isPm = (hh ?? 9) >= 12
  const display = (hh ?? 9) % 12 || 12
  return `${display}:${String(mm ?? 0).padStart(2, '0')} ${isPm ? 'PM' : 'AM'}`
}

export function RuleCard({ rule, compact, style }: Props) {
  const notifyRow = rule.notificationTime
    ? [{ label: 'Notify', value: formatTime12(rule.notificationTime) }]
    : []

  const rows = compact
    ? [
        { label: 'When', value: rule.trigger },
        { label: 'Rule', value: rule.constraint },
        { label: 'For', value: rule.duration },
        ...notifyRow,
      ]
    : [
        { label: 'Trigger', value: rule.trigger },
        { label: 'Constraint', value: rule.constraint },
        { label: 'Action', value: rule.action },
        { label: 'Duration', value: rule.duration },
        ...notifyRow,
      ]

  return (
    <View style={[s.card, style]}>
      {rows.map((r, i) => (
        <View key={r.label} style={[s.row, i < rows.length - 1 && s.rowBorder]}>
          <Text style={s.label}>{r.label}</Text>
          <Text style={s.value}>{r.value}</Text>
        </View>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  card: { ...cardSurface, paddingHorizontal: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 5,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Borders.subtle },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.secondary,
    width: 60,
  },
  value: { flex: 1, fontSize: 14, color: Colors.primary, fontWeight: '500' },
})
