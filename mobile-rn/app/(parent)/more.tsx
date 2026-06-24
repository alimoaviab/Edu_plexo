import { ModuleListScreen, type ModuleListItem } from '@/components/layout/ModuleListScreen';

const ITEMS: ModuleListItem[] = [
  { key: 'fees', label: 'Fees', description: 'Dues, vouchers and payments', icon: 'wallet', accent: 'success', href: '/(parent)/module/fees' },
  { key: 'behavior', label: 'Behavior', description: 'Discipline & merit notes', icon: 'shield', accent: 'warning', href: '/(parent)/module/behavior' },
  { key: 'leave', label: 'Leave', description: "Apply for your child's leave", icon: 'clock', accent: 'warning', href: '/(parent)/module/leave' },
  { key: 'events', label: 'Events', description: 'School calendar & activities', icon: 'calendar', accent: 'primary', href: '/(parent)/module/events' },
  { key: 'messages', label: 'Messages', description: 'Message teachers and staff', icon: 'mail', accent: 'primary', href: '/(parent)/module/messages' },
];

export default function ParentMore() {
  return (
    <ModuleListScreen
      greeting="More"
      title="Fees & Comms"
      subtitle="Payments, leave, events and messaging"
      items={ITEMS}
    />
  );
}
