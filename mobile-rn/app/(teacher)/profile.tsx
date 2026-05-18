import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';
import { useAuthStore } from '@/store/auth-store';

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function confirmLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  }

  const items: ModuleListItem[] = [
    { key: 'profile', label: user?.email ?? 'Account', description: 'Profile & preferences', icon: 'shield', accent: 'primary', onPress: () => router.push('/modules/profile' as never) },
    { key: 'leave', label: 'My Leave', description: 'Apply or check status', icon: 'clock', accent: 'warning', onPress: () => router.push('/modules/leave' as never) },
    { key: 'notifications', label: 'Notifications', description: 'Inbox', icon: 'bell', accent: 'warning', onPress: () => router.push('/modules/notifications' as never) },
    { key: 'logout', label: 'Sign Out', description: 'End your session', icon: 'logout', accent: 'error', onPress: confirmLogout },
  ];

  return (
    <ModuleListScreen
      greeting="Account"
      title="Profile"
      subtitle="Preferences and settings"
      items={items}
    />
  );
}
