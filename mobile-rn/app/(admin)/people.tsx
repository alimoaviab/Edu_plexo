import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'students', label: 'Students', description: 'Profiles, enrollment, history', icon: 'graduation', accent: 'primary', href: '/(admin)/module/students' },
  { key: 'teachers', label: 'Teachers', description: 'Faculty roster & assignments', icon: 'users', accent: 'primary', href: '/(admin)/module/teachers' },
  { key: 'behavior', label: 'Student Behavior', description: 'Discipline & merit notes', icon: 'shield', accent: 'warning', href: '/(admin)/module/behavior' },
  { key: 'leave', label: 'Teacher Leave', description: 'Leave approvals queue', icon: 'clock', accent: 'warning', href: '/(admin)/module/leave' },
  { key: 'announcements', label: 'Announcements', description: 'School-wide broadcasts', icon: 'megaphone', accent: 'primary', href: '/(admin)/module/announcements' },
  { key: 'events', label: 'Events', description: 'School calendar & RSVP', icon: 'calendar', accent: 'success', href: '/(admin)/module/events' },
  { key: 'fees', label: 'Fees', description: 'Vouchers, payments and ledger', icon: 'wallet', accent: 'success', href: '/(admin)/module/fees' },
  { key: 'subscription', label: 'Subscription', description: 'Plan, limits and packages', icon: 'wallet', accent: 'success', href: '/(admin)/module/subscription' },
];

export default function People() {
  return (
    <ModuleListScreen
      greeting="Community"
      title="People & Comms"
      subtitle="Students, teachers, parents and announcements"
      items={ITEMS}
    />
  );
}
