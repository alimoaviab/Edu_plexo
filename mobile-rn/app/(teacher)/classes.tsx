import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'classes', label: 'My Classes', description: 'Sections you teach', icon: 'graduation', accent: 'primary', href: '/(teacher)/module/classes' },
  { key: 'timetable', label: 'Timetable', description: 'This week\u2019s schedule', icon: 'calendar', accent: 'success', href: '/(teacher)/module/timetable' },
  { key: 'live-classes', label: 'Live Classes', description: 'Start or join sessions', icon: 'video', accent: 'primary', href: '/(teacher)/module/live-classes' },
  { key: 'results', label: 'Results', description: 'Class results & marks', icon: 'star', accent: 'success', href: '/(teacher)/module/results' },
];

export default function Classes() {
  return (
    <ModuleListScreen
      greeting="Teaching"
      title="My Classes"
      subtitle="Schedules and live sessions"
      items={ITEMS}
    />
  );
}
