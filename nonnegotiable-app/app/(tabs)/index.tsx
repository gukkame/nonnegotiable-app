import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../../lib/AppContext';
import { computeStreak, getWeekKeys, todayKey } from '../../lib/date';
import { C } from '../../lib/colors';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HomeScreen() {
  const { nonnegotiable, checkIns, todayValue, markToday, resetAll } = useApp();
  const router  = useRouter();
  const streak  = computeStreak(checkIns);
  const weekKeys = getWeekKeys();
  const today   = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  if (!nonnegotiable) return null;

  const confirmReset = () =>
    Alert.alert('Reset project?', 'This clears your nonnegotiable and all check-ins.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetAll },
    ]);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        {/* Top row: project + streak */}
        <View style={s.topRow}>
          <View>
            <Text style={s.label}>Project</Text>
            <Text style={s.projectName}>{nonnegotiable.projectName}</Text>
          </View>
          {streak > 0 && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.label}>Streak</Text>
              <Text style={s.streakBadge}>{streak}d</Text>
            </View>
          )}
        </View>

        {/* Week strip */}
        <View style={s.weekStrip}>
          {DAY_LABELS.map((d, i) => {
            const val     = checkIns[weekKeys[i]];
            const isToday = i === todayIdx;
            return (
              <View key={i} style={s.dayCol}>
                <Text style={[s.dayLabel, isToday && { color: C.primary }]}>{d}</Text>
                <View style={[
                  s.dayDot,
                  val === 'yes' && { backgroundColor: C.success, borderColor: 'transparent' },
                  val === 'no'  && { borderColor: C.failure + '55' },
                  isToday && !val && { borderColor: C.accent + '80' },
                ]}>
                  {val === 'yes' && (
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>✓</Text>
                  )}
                  {val === 'no' && (
                    <Text style={{ color: C.failure, fontSize: 10 }}>✕</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Center: action + why */}
        <View style={s.center}>
          <Text style={s.sectionAccent}>Today's nonnegotiable</Text>
          <Text style={s.action}>{nonnegotiable.action}</Text>
          <View style={s.whyBorder}>
            <Text style={s.why}>"{nonnegotiable.why}"</Text>
          </View>
        </View>

        {/* Bottom: actions */}
        <View>
          {!todayValue ? (
            <>
              <View style={s.yesNoRow}>
                <Pressable
                  style={({ pressed }) => [s.btn, s.btnYes, pressed && s.pressed]}
                  onPress={() => markToday('yes')}
                >
                  <Text style={s.btnText}>YES</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [s.btn, s.btnNo, pressed && s.pressed]}
                  onPress={() => markToday('no')}
                >
                  <Text style={s.btnText}>NO</Text>
                </Pressable>
              </View>
              <Pressable style={s.frictionLink} onPress={() => router.push('/friction')}>
                <Text style={s.frictionText}>Make it easier →</Text>
              </Pressable>
            </>
          ) : (
            <View style={[
              s.doneCard,
              { borderColor: todayValue === 'yes' ? C.success + '40' : C.failure + '40',
                backgroundColor: todayValue === 'yes' ? C.success + '10' : C.failure + '10' },
            ]}>
              <Text style={[s.doneTitle, { color: todayValue === 'yes' ? C.success : C.failure }]}>
                {todayValue === 'yes' ? 'You showed up.' : 'You missed today.'}
              </Text>
              <Text style={s.doneSubtitle}>
                {todayValue === 'yes' ? 'Come back tomorrow.' : 'Tomorrow is still there.'}
              </Text>
            </View>
          )}

          <Pressable style={s.resetLink} onPress={confirmReset}>
            <Text style={s.resetText}>Reset project</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  container:   { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  topRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  label:       { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: C.secondary, marginBottom: 3 },
  projectName: { fontSize: 18, fontWeight: '600', color: C.primary },
  streakBadge: { fontSize: 18, fontWeight: '700', color: C.primary },
  weekStrip:   { flexDirection: 'row', gap: 8, marginBottom: 36 },
  dayCol:      { flex: 1, alignItems: 'center', gap: 5 },
  dayLabel:    { fontSize: 11, color: C.secondary },
  dayDot:      { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  center:      { flex: 1, justifyContent: 'center' },
  sectionAccent: { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: C.accent, marginBottom: 14 },
  action:      { fontSize: 30, fontWeight: '800', color: C.primary, lineHeight: 38, letterSpacing: -0.5, marginBottom: 20 },
  whyBorder:   { borderLeftWidth: 2, borderLeftColor: C.accent + '45', paddingLeft: 14 },
  why:         { fontSize: 15, color: C.secondary, fontStyle: 'italic', lineHeight: 24 },
  yesNoRow:    { flexDirection: 'row', gap: 12, marginBottom: 4 },
  btn:         { flex: 1, paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  btnYes:      { backgroundColor: C.success },
  btnNo:       { backgroundColor: C.failure },
  btnText:     { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  pressed:     { opacity: 0.68 },
  frictionLink:{ alignItems: 'center', paddingVertical: 14 },
  frictionText:{ fontSize: 13, color: C.secondary },
  doneCard:    { borderWidth: 1, borderRadius: 14, padding: 18 },
  doneTitle:   { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  doneSubtitle:{ fontSize: 13, color: C.secondary },
  resetLink:   { alignItems: 'center', paddingTop: 16 },
  resetText:   { fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: 0.5 },
});
