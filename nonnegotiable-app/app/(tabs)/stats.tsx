import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../../lib/AppContext'
import {
  computeStreak,
  computeLongestStreak,
  totalCheckIns,
  todayKey,
} from '../../lib/date'
import { Colors } from '../../lib/colors'
import React from 'react'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const H_PADDING = 26
const CELL_GAP = 6

function buildMonthCells(
  year: number,
  month: number,
  checkIns: Record<string, string | undefined>,
) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (firstDay.getDay() + 6) % 7 // 0=Mon … 6=Sun
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, i) => {
    const day = i - offset + 1
    if (day < 1 || day > daysInMonth) return null
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const key = `${year}-${mm}-${dd}`
    return { day, key, val: checkIns[key] as 'yes' | 'no' | undefined }
  })
}

// Split flat array into chunks of n
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

export default function StatsScreen() {
  const { checkIns, nonnegotiable } = useApp()
  const { width } = useWindowDimensions()

  const cellSize = Math.floor((width - H_PADDING * 2 - CELL_GAP * 6) / 7)

  const streak = computeStreak(checkIns)
  const longest = computeLongestStreak(checkIns)
  const total = totalCheckIns(checkIns)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const cells = buildMonthCells(year, month, checkIns)
  const rows = chunk(cells, 7)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = todayKey()
  const monthYes = cells.filter((c) => c?.val === 'yes').length
  const monthRate = Math.round((monthYes / daysInMonth) * 100)

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Stats</Text>

        {/* Metric cards */}
        <View style={s.cards}>
          {[
            {
              label: 'Streak',
              value: streak,
              suffix: streak === 1 ? 'day' : 'days',
            },
            {
              label: 'Best',
              value: longest,
              suffix: longest === 1 ? 'day' : 'days',
            },
            {
              label: 'Total',
              value: total,
              suffix: total === 1 ? 'check-in' : 'check-ins',
            },
          ].map((m) => (
            <View key={m.label} style={s.card}>
              <Text style={s.cardLabel}>{m.label}</Text>
              <Text style={s.cardValue}>{m.value}</Text>
              <Text style={s.cardSuffix}>{m.suffix}</Text>
            </View>
          ))}
        </View>

        {/* Month header */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionLabel}>{monthLabel}</Text>
          <Text style={s.monthRate}>
            {monthYes}/{daysInMonth}
            <Text style={s.monthRateSub}> · {monthRate}%</Text>
          </Text>
        </View>

        {/* Day-of-week headers */}
        <View style={[s.row, { marginBottom: 4 }]}>
          {DAY_LABELS.map((l, i) => (
            <Text key={i} style={[s.dayHeader, { width: cellSize }]}>
              {l}
            </Text>
          ))}
        </View>

        {/* Calendar rows */}
        {rows.map((row, ri) => (
          <View key={ri} style={[s.row, { marginBottom: CELL_GAP }]}>
            {row.map((cell, ci) => {
              const isToday = cell?.key === todayStr
              return (
                <View
                  key={ci}
                  style={[
                    s.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      borderRadius: cellSize * 0.28,
                    },
                    cell === null && s.cellEmpty,
                    cell?.val === 'yes' && s.cellYes,
                    cell?.val === 'no' && s.cellNo,
                    isToday && s.cellToday,
                  ]}
                >
                  {cell !== null && (
                    <Text
                      style={[
                        s.dayNum,
                        cell.val === 'yes' && s.dayNumYes,
                        isToday && s.dayNumToday,
                      ]}
                    >
                      {cell.day}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        ))}

        {/* Tracking since */}
        {nonnegotiable && (
          <View style={s.since}>
            <Text style={s.sinceLabel}>Tracking since</Text>
            <Text style={s.sinceValue}>
              {new Date(nonnegotiable.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: H_PADDING, paddingTop: 32, paddingBottom: 48 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: 28,
  },

  cards: { flexDirection: 'row', gap: 10, marginBottom: 36 },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 34,
  },
  cardSuffix: { fontSize: 11, color: Colors.secondary, marginTop: 4 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  monthRate: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  monthRateSub: { fontSize: 12, fontWeight: '400', color: Colors.secondary },

  row: { flexDirection: 'row', gap: CELL_GAP },
  dayHeader: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.secondary,
    opacity: 0.5,
  },

  cell: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellEmpty: { backgroundColor: 'transparent', borderColor: 'transparent' },
  cellYes: { backgroundColor: Colors.success, borderColor: 'transparent' },
  cellNo: {
    backgroundColor: Colors.failure + '33',
    borderColor: 'transparent',
  },
  cellToday: { borderColor: Colors.accent, borderWidth: 1.5 },

  dayNum: { fontSize: 11, fontWeight: '500', color: Colors.secondary },
  dayNumYes: { color: '#fff', fontWeight: '700' },
  dayNumToday: { color: Colors.primary },

  since: {
    marginTop: 36,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  sinceLabel: { fontSize: 12, color: Colors.secondary },
  sinceValue: { fontSize: 15, color: Colors.primary, marginTop: 4 },
})
