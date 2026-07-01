import { Tabs } from 'expo-router';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, typography } from '@/theme/tokens';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray100,
          height: 64,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => (
          <Icon name={routeIcon(route.name)} size={size ?? 22} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="students" options={{ title: 'Students' }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
      <Tabs.Screen name="teachers" options={{ title: 'Teachers' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="academics" options={{ href: null, title: 'Academics' }} />
      <Tabs.Screen name="people" options={{ href: null, title: 'People' }} />
      <Tabs.Screen name="settings" options={{ href: null, title: 'Settings' }} />
      <Tabs.Screen name="module/[module]" options={{ href: null, title: 'Module' }} />
    </Tabs>
  );
}

function routeIcon(name: string): IconName {
  switch (name) {
    case 'index':
      return 'home';
    case 'students':
      return 'graduation';
    case 'attendance':
      return 'check-circle';
    case 'teachers':
      return 'users';
    case 'profile':
      return 'shield';
    default:
      return 'home';
  }
}
