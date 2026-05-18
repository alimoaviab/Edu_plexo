import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function People() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'students', label: 'Students', description: 'Profiles, enrollment, history', icon: 'graduation', accent: 'primary', onPress: () => router.push('/modules/students' as never) },
    { key: 'teachers', label: 'Teachers', description: 'Faculty roster & assignments', icon: 'users', accent: 'primary', onPress: () => router.push('/modules/teachers' as never) },
    { key: 'behavior', label: 'Student Behavior', description: 'Discipline & merit notes', icon: 'shield', accent: 'warning', onPress: () => router.push('/modules/behavior' as never) },
    { key: 'leave', label: 'Teacher Leave', description: 'Leave approvals queue', icon: 'clock', accent: 'warning', onPress: () => router.push('/modules/leave' as never) },
    { key: 'announcements', label: 'Announcements', description: 'School-wide broadcasts', icon: 'megaphone', accent: 'primary', onPress: () => router.push('/modules/announcements' as never) },
    { key: 'events', label: 'Events', description: 'School calendar & RSVP', icon: 'calendar', accent: 'success', onPress: () => router.push('/modules/events' as never) },
    { key: 'fees', label: 'Fees & Subscription', description: 'Billing & payments', icon: 'wallet', accent: 'success', onPress: () => router.push('/modules/fees' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Community"
      title="People & Comms"
      subtitle="Students, teachers, parents and announcements"
      items={ITEMS}
    />
  );
}
