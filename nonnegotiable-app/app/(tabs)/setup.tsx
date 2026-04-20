import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { C } from '../../lib/colors';

export default function SetupTabScreen() {
  const { nonnegotiable, setNonnegotiable, resetAll } = useApp();

  const [projectName, setProjectName] = useState(nonnegotiable?.projectName ?? '');
  const [action, setAction]           = useState(nonnegotiable?.action ?? '');
  const [why, setWhy]                 = useState(nonnegotiable?.why ?? '');

  const canSubmit = projectName.trim() && action.trim() && why.trim();
  const hasChanges =
    projectName.trim() !== (nonnegotiable?.projectName ?? '') ||
    action.trim()      !== (nonnegotiable?.action ?? '') ||
    why.trim()         !== (nonnegotiable?.why ?? '');

  const onSave = async () => {
    if (!canSubmit) return;
    await setNonnegotiable({
      projectName: projectName.trim(),
      action:      action.trim(),
      why:         why.trim(),
      createdAt:   nonnegotiable?.createdAt ?? new Date().toISOString(),
    });
    Alert.alert('Saved', 'Your nonnegotiable has been updated.');
  };

  const confirmReset = () =>
    Alert.alert('Reset everything?', 'This clears your nonnegotiable and all check-ins.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetAll },
    ]);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.heading}>Your nonnegotiable</Text>
          <Text style={s.sub}>Edit to refine. Clarity compounds.</Text>

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
            label="Why — one sentence"
            placeholder="e.g. Because I owe it to my future self."
            value={why}
            onChangeText={setWhy}
            multiline
          />

          <Pressable
            onPress={onSave}
            disabled={!canSubmit || !hasChanges}
            style={({ pressed }) => [
              s.btn,
              (!canSubmit || !hasChanges) && s.btnDisabled,
              pressed && { opacity: 0.72 },
            ]}
          >
            <Text style={s.btnText}>Save changes</Text>
          </Pressable>

          <Pressable style={s.resetLink} onPress={confirmReset}>
            <Text style={s.resetText}>Reset project &amp; check-ins</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label, placeholder, value, onChangeText, multiline,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.secondary + '80'}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          s.input,
          multiline && s.inputMulti,
          focused && s.inputFocused,
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  scroll:       { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  heading:      { fontSize: 26, fontWeight: '800', color: C.primary, letterSpacing: -0.5, lineHeight: 32, marginBottom: 8 },
  sub:          { fontSize: 14, color: C.secondary, lineHeight: 22, marginBottom: 36 },
  field:        { marginBottom: 22 },
  fieldLabel:   { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: C.secondary, marginBottom: 8 },
  input:        { backgroundColor: C.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, color: C.primary, fontSize: 16, lineHeight: 24 },
  inputMulti:   { minHeight: 78, textAlignVertical: 'top' },
  inputFocused: { borderColor: C.accent + '60' },
  btn:          { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 12 },
  btnDisabled:  { backgroundColor: C.card, opacity: 0.4 },
  btnText:      { fontSize: 16, fontWeight: '600', color: '#fff' },
  resetLink:    { alignItems: 'center', paddingTop: 24 },
  resetText:    { fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5 },
});
