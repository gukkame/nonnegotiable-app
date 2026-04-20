import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { computeStreak, computeLongestStreak, totalCheckIns, daysAgoKey } from '../../lib/date';
import { C } from '../../lib/colors';

export default function StatsScreen() {
  const { checkIns, nonnegotiable } = useApp();

  const streak  = computeStreak(checkIns);
  const longest = computeLongestStreak(checkIns);
  const total   = totalCheckIns(checkIns);

  // Build last 30 days oldest → newest
  const days = Array.from({ length: 30 }, (_, i) => {
    const key = daysAgoKey(29 - i);
    return { key, val: checkIns[key] };
  });

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Stats</Text>

        {/* Metric cards */}
        <View style={s.cards}>
          {[
            { label: 'Current',  value: streak,  suffix: streak  === 1 ? 'day' : 'days' },
            { label: 'Longest',  value: longest, suffix: longest === 1 ? 'day' : 'days' },
            { label: 'Yes',      value: total,   suffix: total   === 1 ? 'check-in' : 'check-ins' },
          ].map(m => (
            <View key={m.label} style={s.card}>
              <Text style={s.cardLabel}>{m.label}</Text>
              <Text style={s.cardValue}>{m.value}</Text>
              <Text style={s.cardSuffix}>{m.suffix}</Text>
            </View>
          ))}
        </View>

        {/* 30-day grid */}
        <Text style={s.sectionLabel}>Last 30 days</Text>
        <View style={s.grid}>
          {days.map(d => (
            <View key={d.key} style={[
              s.dot,
              d.val === 'yes' && { backgroundColor: C.success, borderColor: 'transparent' },
              d.val === 'no'  && { backgroundColor: C.failure + '44', borderColor: 'transparent' },
            ]} />
          ))}
        </View>

        {/* Tracking since */}
        {nonnegotiable && (
          <View style={s.since}>
            <Text style={s.sinceLabel}>Tracking since</Text>
            <Text style={s.sinceValue}>
              {new Date(nonnegotiable.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  scroll:      { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  title:       { fontSize: 28, fontWeight: '800', color: C.primary, letterSpacing: -0.5, marginBottom: 28 },
  cards:       { flexDirection: 'row', gap: 10, marginBottom: 36 },
  card:        { flex: 1, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: 14 },
  cardLabel:   { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.secondary, marginBottom: 6 },
  cardValue:   { fontSize: 30, fontWeight: '800', color: C.primary, lineHeight: 34 },
  cardSuffix:  { fontSize: 11, color: C.secondary, marginTop: 4 },
  sectionLabel:{ fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: C.secondary, marginBottom: 12 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  dot:         { width: 26, height: 26, borderRadius: 7, backgroundColor: C.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  since:       { marginTop: 36, paddingTop: 22, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  sinceLabel:  { fontSize: 12, color: C.secondary },
  sinceValue:  { fontSize: 15, color: C.primary, marginTop: 4 },
});
