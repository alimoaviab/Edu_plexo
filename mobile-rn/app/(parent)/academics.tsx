import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'attendance', label: 'Attendance', description: "Your child's attendance record", icon: 'check-circle', accent: 'success', href: '/(parent)/module/attendance' },
  { key: 'results', label: 'Results', description: 'Exam and test marks', icon: 'star', accent: 'success', href: '/(parent)/module/results' },
  { key: 'homework', label: 'Homework', description: 'Assignments & submissions', icon: 'book', accent: 'primary', href: '/(parent)/module/homework' },
  { key: 'exams', label: 'Exams', description: 'Upcoming exam schedule', icon: 'clipboard', accent: 'warning', href: '/(parent)/module/exams' },
  { key: 'timetable', label: 'Timetable', description: 'Weekly class schedule', icon: 'calendar', accent: 'success', href: '/(parent)/module/timetable' },
  { key: 'live-classes', label: 'Live Classes', description: 'Online sessions', icon: 'video', accent: 'primary', href: '/(parent)/module/live-classes' },
  { key: 'announcements', label: 'Announcements', description: 'School & class notices', icon: 'megaphone', accent: 'primary', href: '/(parent)/module/announcements' },
];

export default function ParentAcademics() {
  return (
    <ModuleListScreen
      greeting="Studies"
      title="Academics"
      subtitle="Attendance, homework, results and schedule"
      items={ITEMS}
    />
  );
}
