import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function StudentMore() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'fees', label: 'Fee Charges', description: 'Pay or view dues', icon: 'wallet', accent: 'success', onPress: () => router.push('/modules/fees' as never) },
    { key: 'children', label: 'Linked Children', description: 'Switch active child', icon: 'family', accent: 'primary', onPress: () => router.push('/modules/children' as never) },
    { key: 'events', label: 'Events', description: 'School calendar', icon: 'calendar', accent: 'primary', onPress: () => router.push('/modules/events' as never) },
    { key: 'announcements', label: 'Announcements', description: 'Notices from school', icon: 'megaphone', accent: 'primary', onPress: () => router.push('/modules/announcements' as never) },
    { key: 'leave', label: 'Leave Requests', description: 'Apply or check status', icon: 'clock', accent: 'warning', onPress: () => router.push('/modules/leave' as never) },
    { key: 'behavior', label: 'My Behavior', description: 'Notes from teachers', icon: 'shield', accent: 'warning', onPress: () => router.push('/modules/behavior' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Updates"
      title="More"
      subtitle="Fees, events and notices"
      items={ITEMS}
    />
  );
}
