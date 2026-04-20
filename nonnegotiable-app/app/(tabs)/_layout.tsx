import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { C } from '../../lib/colors';

function TabIcon({
  id,
  color,
  focused,
}: {
  id: string;
  color: string;
  focused: boolean;
}) {
  const fill = focused ? color + '28' : 'transparent';
  if (id === 'today')
    return (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          fill={fill}
        />
        <Path d="M8 20v-7h6v7" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      </Svg>
    );
  if (id === 'week')
    return (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Rect x={3} y={5} width={16} height={15} rx={2} stroke={color} strokeWidth={1.5} fill={fill} />
        <Path d="M7 3v4M15 3v4M3 10h16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  if (id === 'stats')
    return (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Rect x={3}  y={12} width={4} height={8}  rx={1.5} fill={fill} stroke={color} strokeWidth={1.5} />
        <Rect x={9}  y={7}  width={4} height={13} rx={1.5} fill={fill} stroke={color} strokeWidth={1.5} />
        <Rect x={15} y={3}  width={4} height={17} rx={1.5} fill={fill} stroke={color} strokeWidth={1.5} />
      </Svg>
    );
  if (id === 'setup')
    return (
      <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
        <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={1.5} fill={fill} />
        <Path d="M11 7v4l3 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  return <View />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(11,11,12,0.97)',
          borderTopColor: 'rgba(255,255,255,0.07)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   C.accent,
        tabBarInactiveTintColor: C.secondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => <TabIcon id="today" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: 'Week',
          tabBarIcon: ({ color, focused }) => <TabIcon id="week" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => <TabIcon id="stats" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="setup"
        options={{
          title: 'Setup',
          tabBarIcon: ({ color, focused }) => <TabIcon id="setup" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
