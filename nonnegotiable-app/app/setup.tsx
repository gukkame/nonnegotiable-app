import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../lib/AppContext';

export default function SetupScreen() {
  const { setNonnegotiable } = useApp();
  const [projectName, setProjectName] = useState('');
  const [action, setAction] = useState('');
  const [why, setWhy] = useState('');

  const canSubmit =
    projectName.trim().length > 0 &&
    action.trim().length > 0 &&
    why.trim().length > 0;

  const onSubmit = async () => {
    if (!canSubmit) return;
    await setNonnegotiable({
      projectName: projectName.trim(),
      action: action.trim(),
      why: why.trim(),
      createdAt: new Date().toISOString(),
    });
    // _layout effect will redirect to (tabs)
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold text-neutral-900 mb-2">
            Define your nonnegotiable
          </Text>
          <Text className="text-base text-neutral-600 mb-10">
            One project. One daily action. One reason.
          </Text>

          <Field
            label="Project name"
            placeholder="e.g. Writing my book"
            value={projectName}
            onChangeText={setProjectName}
          />

          <Field
            label="Your nonnegotiable action"
            placeholder="e.g. Write 500 words"
            value={action}
            onChangeText={setAction}
            multiline
          />

          <Field
            label="Why (one sentence)"
            placeholder="e.g. Because I owe it to my future self."
            value={why}
            onChangeText={setWhy}
            multiline
          />

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            className={`rounded-2xl py-5 items-center mt-6 ${
              canSubmit ? 'bg-neutral-900' : 'bg-neutral-300'
            }`}
          >
            <Text className="text-lg font-semibold text-white">Commit</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View className="mb-6">
      <Text className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        multiline={multiline}
        className="border border-neutral-200 rounded-xl px-4 py-3 text-base text-neutral-900 bg-neutral-50"
        style={multiline ? { minHeight: 72, textAlignVertical: 'top' } : undefined}
      />
    </View>
  );
}
