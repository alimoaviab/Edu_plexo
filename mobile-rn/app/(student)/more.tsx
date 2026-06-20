import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'fees', label: 'Fee Charges', description: 'Pay or view dues', icon: 'wallet', accent: 'success', href: '/(student)/module/fees' },
  { key: 'behavior', label: 'Behavior', description: 'My conduct notes', icon: 'shield', accent: 'warning', href: '/(student)/module/behavior' },
  { key: 'leave', label: 'Leave', description: 'Apply for leave', icon: 'clock', accent: 'warning', href: '/(student)/module/leave' },
  { key: 'events', label: 'Events', description: 'School calendar', icon: 'megaphone', accent: 'primary', href: '/(student)/module/events' },
  { key: 'announcements', label: 'Announcements', description: 'Notices from school', icon: 'megaphone', accent: 'primary', href: '/(student)/module/announcements' },
  { key: 'messages', label: 'Messages', description: 'Contact teachers', icon: 'mail', accent: 'primary', href: '/(student)/module/messages' },
];

export default function StudentMore() {
  return (
    <ModuleListScreen
      greeting="Updates"
      title="More"
      subtitle="Fees, events and notices"
      items={ITEMS}
    />
  );
}
