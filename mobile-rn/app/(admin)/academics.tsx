import { useRouter } from 'expo-router';

import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

export default function Academics() {
  const router = useRouter();
  const ITEMS: ModuleListItem[] = [
    { key: 'classes', label: 'Classes', description: 'Sections, batches, subject mapping', icon: 'graduation', accent: 'primary', onPress: () => router.push('/modules/classes' as never) },
    { key: 'subjects', label: 'Subjects', description: 'Curriculum & batch assignment', icon: 'book', accent: 'primary', onPress: () => router.push('/modules/subjects' as never) },
    { key: 'timetable', label: 'Timetable', description: 'Weekly schedules per class', icon: 'calendar', accent: 'success', onPress: () => router.push('/modules/timetable' as never) },
    { key: 'attendance', label: 'Attendance', description: 'Daily attendance & analytics', icon: 'check-circle', accent: 'success', onPress: () => router.push('/modules/attendance' as never) },
    { key: 'exams', label: 'Exams', description: 'Term exams & schedules', icon: 'clipboard', accent: 'warning', onPress: () => router.push('/modules/exams' as never) },
    { key: 'tests', label: 'Tests', description: 'Class tests & quizzes', icon: 'clipboard', accent: 'warning', onPress: () => router.push('/modules/tests' as never) },
    { key: 'results', label: 'Results', description: 'Marks, marksheets, transcripts', icon: 'star', accent: 'success', onPress: () => router.push('/modules/results' as never) },
    { key: 'live-classes', label: 'Live Classes', description: 'Online sessions & recordings', icon: 'video', accent: 'primary', onPress: () => router.push('/modules/live-classes' as never) },
    { key: 'homework', label: 'Homework', description: 'Assignments & submissions', icon: 'book', accent: 'primary', onPress: () => router.push('/modules/homework' as never) },
  ];

  return (
    <ModuleListScreen
      greeting="Academic Care"
      title="Academics"
      subtitle="Curriculum, schedules and evaluations"
      items={ITEMS}
    />
  );
}
