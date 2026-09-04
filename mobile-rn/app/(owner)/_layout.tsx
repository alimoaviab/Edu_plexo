import { Tabs } from 'expo-router';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, typography } from '@/theme/tokens';

export default function OwnerLayout() {
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
      <Tabs.Screen name="schools" options={{ title: 'My Schools' }} />
      <Tabs.Screen name="subscription" options={{ title: 'Subscription' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="payment" options={{ href: null, title: 'Upgrade Payment' }} />
      <Tabs.Screen name="custom-plan" options={{ href: null, title: 'Build Your Own Plan' }} />
    </Tabs>
  );
}

function routeIcon(name: string): IconName {
  switch (name) {
    case 'index':
      return 'home';
    case 'schools':
      return 'building';
    case 'subscription':
      return 'wallet';
    case 'profile':
      return 'shield';
    default:
      return 'home';
  }
}