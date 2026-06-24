import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'timetable', label: 'Timetable', description: 'This week\u2019s schedule', icon: 'calendar', accent: 'success', href: '/(student)/module/timetable' },
  { key: 'attendance', label: 'Attendance', description: 'My attendance record', icon: 'check-circle', accent: 'success', href: '/(student)/module/attendance' },
  { key: 'homework', label: 'Homework', description: 'Assignments & submissions', icon: 'book', accent: 'primary', href: '/(student)/module/homework' },
  { key: 'exams', label: 'Exams', description: 'Upcoming exams', icon: 'clipboard', accent: 'warning', href: '/(student)/module/exams' },
  { key: 'results', label: 'Results', description: 'Marks & marksheets', icon: 'star', accent: 'success', href: '/(student)/module/results' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(student)/module/live-classes' },
];

export default function StudentAcademics() {
  return (
    <ModuleListScreen
      greeting="Studies"
      title="Academics"
      subtitle="Schedule, attendance and grades"
      items={ITEMS}
    />
  );
}
