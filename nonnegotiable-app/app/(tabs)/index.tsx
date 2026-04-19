import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { computeStreak } from '../../lib/date';

export default function HomeScreen() {
  const { nonnegotiable, checkIns, toggleToday, isCheckedToday, resetAll } = useApp();
  const streak = computeStreak(checkIns);

  if (!nonnegotiable) return null; // _layout redirects to /setup

  const confirmReset = () => {
    Alert.alert(
      'Reset project?',
      'This clears your nonnegotiable and all check-ins.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8 pb-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-sm uppercase tracking-wider text-neutral-500">
            Project
          </Text>
          <Text className="text-2xl font-semibold text-neutral-900 mt-1">
            {nonnegotiable.projectName}
          </Text>
        </View>

        {/* The nonnegotiable */}
        <View className="mb-6">
          <Text className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
            Today's nonnegotiable
          </Text>
          <Text className="text-3xl font-bold text-neutral-900 leading-snug">
            {nonnegotiable.action}
          </Text>
        </View>

        {/* Why */}
        <View className="mb-10 border-l-2 border-neutral-300 pl-4">
          <Text className="text-sm uppercase tracking-wider text-neutral-500 mb-1">
            Why
          </Text>
          <Text className="text-base text-neutral-700 italic">
            "{nonnegotiable.why}"
          </Text>
        </View>

        {/* Streak */}
        <View className="mb-10">
          <Text className="text-sm uppercase tracking-wider text-neutral-500">
            Current streak
          </Text>
          <Text className="text-6xl font-bold text-neutral-900 mt-1">
            {streak}
            <Text className="text-2xl font-normal text-neutral-500">
              {' '}
              {streak === 1 ? 'day' : 'days'}
            </Text>
          </Text>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Check-in button */}
        <Pressable
          onPress={toggleToday}
          className={`rounded-2xl py-5 items-center ${
            isCheckedToday ? 'bg-neutral-200' : 'bg-neutral-900'
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              isCheckedToday ? 'text-neutral-700' : 'text-white'
            }`}
          >
            {isCheckedToday ? '✓ Done for today' : 'Mark as done'}
          </Text>
        </Pressable>

        {/* Reset — dev escape hatch */}
        <Pressable onPress={confirmReset} className="mt-4 items-center">
          <Text className="text-xs text-neutral-400">Reset project</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
