import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'attendance', label: 'Attendance', description: 'Mark today\u2019s attendance', icon: 'check-circle', accent: 'success', href: '/(teacher)/module/attendance' },
  { key: 'homework', label: 'Homework', description: 'Assign or grade', icon: 'book', accent: 'primary', href: '/(teacher)/module/homework' },
  { key: 'tests', label: 'Tests', description: 'Schedule class tests', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/tests' },
  { key: 'exams', label: 'Exams', description: 'Term exam schedule', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/exams' },
  { key: 'results', label: 'Results', description: 'Enter marks', icon: 'star', accent: 'success', href: '/(teacher)/module/results' },
  { key: 'behavior', label: 'Behavior Notes', description: 'Add discipline / merit notes', icon: 'shield', accent: 'warning', href: '/(teacher)/module/behavior' },
  { key: 'question-papers', label: 'Question Papers', description: 'Build & save papers', icon: 'clipboard', accent: 'warning', href: '/(teacher)/module/question-papers' },
  { key: 'announcements', label: 'Announcements', description: 'Post a notice', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/announcements' },
  { key: 'leave', label: 'Apply for Leave', description: 'Request time off', icon: 'clock', accent: 'warning', href: '/(teacher)/module/leave' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(teacher)/module/events' },
  { key: 'schedules', label: 'Schedule', description: 'Reminders & planner', icon: 'calendar', accent: 'success', href: '/(teacher)/module/schedules' },
  { key: 'messages', label: 'Messages', description: 'Conversations', icon: 'mail', accent: 'primary', href: '/(teacher)/module/messages' },
];

export default function Actions() {
  return (
    <ModuleListScreen
      greeting="Daily Tasks"
      title="Actions"
      subtitle="Mark, grade, and update"
      items={ITEMS}
    />
  );
}
