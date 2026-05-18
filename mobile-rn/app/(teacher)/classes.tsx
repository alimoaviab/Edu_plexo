import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function Classes() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'classes', label: 'My Classes', description: 'Sections you teach', icon: 'graduation', accent: 'primary', onPress: () => router.push('/modules/classes' as never) },
    { key: 'timetable', label: 'Timetable', description: 'This week\u2019s schedule', icon: 'calendar', accent: 'success', onPress: () => router.push('/modules/timetable' as never) },
    { key: 'live-classes', label: 'Live Classes', description: 'Start or join sessions', icon: 'video', accent: 'primary', onPress: () => router.push('/modules/live-classes' as never) },
    { key: 'students', label: 'Students', description: 'Browse student roster', icon: 'users', accent: 'primary', onPress: () => router.push('/modules/students' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Teaching"
      title="My Classes"
      subtitle="Schedules and live sessions"
      items={ITEMS}
    />
  );
}
