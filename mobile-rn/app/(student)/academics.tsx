import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function StudentAcademics() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'timetable', label: 'Timetable', description: 'This week\u2019s schedule', icon: 'calendar', accent: 'success', onPress: () => router.push('/modules/timetable' as never) },
    { key: 'attendance', label: 'Attendance', description: 'My attendance record', icon: 'check-circle', accent: 'success', onPress: () => router.push('/modules/attendance' as never) },
    { key: 'homework', label: 'Homework', description: 'Assignments & submissions', icon: 'book', accent: 'primary', onPress: () => router.push('/modules/homework' as never) },
    { key: 'exams', label: 'Exams', description: 'Upcoming exams', icon: 'clipboard', accent: 'warning', onPress: () => router.push('/modules/exams' as never) },
    { key: 'results', label: 'Results', description: 'Marks & marksheets', icon: 'star', accent: 'success', onPress: () => router.push('/modules/results' as never) },
    { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', onPress: () => router.push('/modules/live-classes' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Studies"
      title="Academics"
      subtitle="Schedule, attendance and grades"
      items={ITEMS}
    />
  );
}
