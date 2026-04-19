import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import {
  computeStreak,
  computeLongestStreak,
  totalCheckIns,
  daysAgoKey,
} from '../../lib/date';

export default function StatsScreen() {
  const { checkIns, nonnegotiable } = useApp();

  const streak = computeStreak(checkIns);
  const longest = computeLongestStreak(checkIns);
  const total = totalCheckIns(checkIns);

  // Build last 30 days, oldest first
  const days = Array.from({ length: 30 }, (_, i) => {
    const idx = 29 - i; // 29 days ago ... today
    const key = daysAgoKey(idx);
    return { key, done: !!checkIns[key] };
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 }}
      >
        <Text className="text-3xl font-bold text-neutral-900 mb-8">Stats</Text>

        {/* Metrics */}
        <View className="flex-row gap-3 mb-10">
          <StatCard label="Current" value={streak} suffix={streak === 1 ? 'day' : 'days'} />
          <StatCard label="Longest" value={longest} suffix={longest === 1 ? 'day' : 'days'} />
          <StatCard label="Total" value={total} suffix={total === 1 ? 'check-in' : 'check-ins'} />
        </View>

        {/* Last 30 days */}
        <Text className="text-sm uppercase tracking-wider text-neutral-500 mb-3">
          Last 30 days
        </Text>
        <View className="flex-row flex-wrap gap-1.5 mb-10">
          {days.map((d) => (
            <View
              key={d.key}
              className={`w-8 h-8 rounded-md ${
                d.done ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            />
          ))}
        </View>

        {nonnegotiable && (
          <View className="border-t border-neutral-200 pt-6">
            <Text className="text-sm text-neutral-500">Tracking since</Text>
            <Text className="text-base text-neutral-900 mt-1">
              {new Date(nonnegotiable.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <View className="flex-1 bg-neutral-100 rounded-2xl p-4">
      <Text className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </Text>
      <Text className="text-3xl font-bold text-neutral-900">{value}</Text>
      <Text className="text-xs text-neutral-500 mt-0.5">{suffix}</Text>
    </View>
  );
}
