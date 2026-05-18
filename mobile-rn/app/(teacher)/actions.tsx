import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function Actions() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'attendance', label: 'Attendance', description: 'Mark today\u2019s attendance', icon: 'check-circle', accent: 'success', onPress: () => router.push('/modules/attendance' as never) },
    { key: 'homework', label: 'Homework', description: 'Assign or grade', icon: 'book', accent: 'primary', onPress: () => router.push('/modules/homework' as never) },
    { key: 'tests', label: 'Tests', description: 'Schedule class tests', icon: 'clipboard', accent: 'warning', onPress: () => router.push('/modules/tests' as never) },
    { key: 'exams', label: 'Exams', description: 'Term exam schedule', icon: 'clipboard', accent: 'warning', onPress: () => router.push('/modules/exams' as never) },
    { key: 'results', label: 'Results', description: 'Enter marks', icon: 'star', accent: 'success', onPress: () => router.push('/modules/results' as never) },
    { key: 'behavior', label: 'Behavior Notes', description: 'Add discipline / merit notes', icon: 'shield', accent: 'warning', onPress: () => router.push('/modules/behavior' as never) },
    { key: 'leave', label: 'Apply for Leave', description: 'Request time off', icon: 'clock', accent: 'warning', onPress: () => router.push('/modules/leave' as never) },
    { key: 'announcements', label: 'Announcements', description: 'School notices', icon: 'megaphone', accent: 'primary', onPress: () => router.push('/modules/announcements' as never) },
    { key: 'events', label: 'Events', description: 'School calendar', icon: 'calendar', accent: 'primary', onPress: () => router.push('/modules/events' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Daily Tasks"
      title="Actions"
      subtitle="Mark, grade, and update"
      items={ITEMS}
    />
  );
}
