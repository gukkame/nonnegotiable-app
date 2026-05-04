import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../../lib/AppContext'
import { sendTestNotification } from '../../lib/notifications'
import { Colors } from '../../lib/colors'
import React from 'react'

function timeToDate(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h ?? 9, m ?? 0, 0, 0)
  return d
}

function dateToTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

function formatTime12(hhmm: string): { time: string; ampm: string } {
  const [hh, mm] = hhmm.split(':').map(Number)
  const isPm = (hh ?? 9) >= 12
  const display = (hh ?? 9) % 12 || 12
  return { time: `${display}:${String(mm ?? 0).padStart(2, '0')}`, ampm: isPm ? 'PM' : 'AM' }
}

export default function SetupTabScreen() {
  const { nonnegotiable, setNonnegotiable, resetAll } = useApp()

  const [projectName, setProjectName] = useState(
    nonnegotiable?.projectName ?? '',
  )
  const [action, setAction] = useState(nonnegotiable?.action ?? '')
  const [bareMinimum, setBareMinimum] = useState(nonnegotiable?.bareMinimum ?? '')
  const [why, setWhy] = useState(nonnegotiable?.why ?? '')
  const [notificationTime, setNotificationTime] = useState(
    nonnegotiable?.notificationTime ?? '09:00',
  )
  const [showTimePicker, setShowTimePicker] = useState(false)

  const canSubmit = projectName.trim() && action.trim() && why.trim()
  const hasChanges =
    projectName.trim() !== (nonnegotiable?.projectName ?? '') ||
    action.trim() !== (nonnegotiable?.action ?? '') ||
    bareMinimum.trim() !== (nonnegotiable?.bareMinimum ?? '') ||
    why.trim() !== (nonnegotiable?.why ?? '') ||
    notificationTime !== (nonnegotiable?.notificationTime ?? '09:00')

  const onSave = async () => {
    if (!canSubmit) return
    await setNonnegotiable({
      projectName: projectName.trim(),
      action: action.trim(),
      bareMinimum: bareMinimum.trim() || undefined,
      why: why.trim(),
      notificationTime,
      createdAt: nonnegotiable?.createdAt ?? new Date().toISOString(),
      weeklyAdjustment: nonnegotiable?.weeklyAdjustment,
    })
    Alert.alert('Saved', 'Your nonnegotiable has been updated.')
  }

  const onTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false)
    if (date) setNotificationTime(dateToTime(date))
  }

  const onTestNotification = async () => {
    if (!canSubmit) {
      Alert.alert('Fill in your nonnegotiable first', 'Set the action and "why" so the test notification has content to show.')
      return
    }
    const ok = await sendTestNotification({
      projectName: projectName.trim(),
      action: action.trim(),
      bareMinimum: bareMinimum.trim() || undefined,
      why: why.trim(),
      notificationTime,
      createdAt: nonnegotiable?.createdAt ?? new Date().toISOString(),
    })
    if (!ok) {
      Alert.alert('Notifications disabled', 'Enable notifications for this app in Settings, then try again.')
      return
    }
    Alert.alert('Test scheduled', 'A notification will arrive in ~3 seconds. Lock your phone or background the app to see the banner.')
  }

  const { time: timeDisplay, ampm } = formatTime12(notificationTime)

  const confirmReset = () =>
    Alert.alert(
      'Reset everything?',
      'This clears your nonnegotiable and all check-ins.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAll },
      ],
    )

  return (
    <SafeAreaView style={styleSheet.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Pressable
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
          accessible={false}
        >
          <ScrollView
            contentContainerStyle={styleSheet.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styleSheet.heading}>Your nonnegotiable</Text>
            <Text style={styleSheet.sub}>
              Edit to refine. Clarity compounds.
            </Text>

            <Field
              label="Project name"
              placeholder="e.g. Writing my book"
              value={projectName}
              onChangeText={setProjectName}
            />
            <Field
              label="Non-negotiable action"
              placeholder="e.g. Write 500 words"
              value={action}
              onChangeText={setAction}
              multiline
            />
            <Field
              label="Bare minimum"
              placeholder="e.g. Open the doc and write one sentence"
              value={bareMinimum}
              onChangeText={setBareMinimum}
              multiline
            />
            <Field
              label="Why — one sentence"
              placeholder="e.g. Because I owe it to my future self"
              value={why}
              onChangeText={setWhy}
              multiline
            />

            <View style={styleSheet.field}>
              <Text style={styleSheet.fieldLabel}>Daily reminder time</Text>
              <Pressable
                style={styleSheet.timeRow}
                onPress={() => setShowTimePicker((v) => !v)}
              >
                <Text style={styleSheet.timeText}>{timeDisplay}</Text>
                <Text style={styleSheet.timeAmpm}>{ampm}</Text>
              </Pressable>
              <Text style={styleSheet.timeHint}>
                You'll get a push notification at this time. A follow-up nudge
                comes 2h later, plus a Sunday weekly check-in.
              </Text>
              {/* <Pressable style={styleSheet.testBtn} onPress={onTestNotification}>
                <Text style={styleSheet.testBtnText}>Send test notification</Text>
              </Pressable> */}
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={timeToDate(notificationTime)}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
                themeVariant="dark"
              />
            )}
            {Platform.OS === 'ios' && showTimePicker && (
              <Pressable
                style={styleSheet.timeConfirm}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styleSheet.timeConfirmText}>Done</Text>
              </Pressable>
            )}

            <Pressable
              onPress={onSave}
              disabled={!canSubmit || !hasChanges}
              style={[
                styleSheet.btn,
                (!canSubmit || !hasChanges) && styleSheet.btnDisabled,
              ]}
            >
              <Text style={styleSheet.btnText}>Save changes</Text>
            </Pressable>

            <Pressable style={styleSheet.resetLink} onPress={confirmReset}>
              <Text style={styleSheet.resetText}>
                Reset project &amp; check-ins
              </Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
}: {
  label: string
  placeholder: string
  value: string
  onChangeText: (v: string) => void
  multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={styleSheet.field}>
      <Text style={styleSheet.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondary + '80'}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styleSheet.input,
          multiline && styleSheet.inputMulti,
          focused && styleSheet.inputFocused,
        ]}
      />
    </View>
  )
}

const styleSheet = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 22,
    marginBottom: 36,
  },
  field: { marginBottom: 22 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 0,
  },
  inputMulti: { textAlignVertical: 'top' },
  inputFocused: { borderColor: Colors.accent + '60' },
  timeRow: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  timeText: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  timeAmpm: { fontSize: 14, fontWeight: '600', color: Colors.secondary },
  timeHint: {
    fontSize: 12,
    color: Colors.secondary,
    lineHeight: 18,
    marginTop: 8,
  },
  timeConfirm: { alignItems: 'flex-end', paddingBottom: 8 },
  timeConfirmText: { fontSize: 15, fontWeight: '600', color: Colors.accent },
  testBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  testBtnText: { fontSize: 13, fontWeight: '600', color: Colors.secondary, letterSpacing: 0.3 },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  btnDisabled: { backgroundColor: Colors.card, opacity: 0.4 },
  btnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  resetLink: { alignItems: 'center', paddingTop: 24 },
  resetText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 0.5,
  },
})
