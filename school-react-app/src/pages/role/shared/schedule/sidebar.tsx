import { AppIcon } from "shared/ui/AppIcon";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ScheduleSidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: "calendar", label: "Calendar", icon: "Calendar" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" },
    { id: "reminders", label: "Reminders", icon: "Bell" },
    { id: "recurring", label: "Recurring", icon: "Repeat" },
  ];

  return (
    <div className="w-48 bg-white border-r border-slate-100 h-screen overflow-y-auto sticky top-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">Schedule</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your calendar</p>
      </div>
      <nav className="p-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <AppIcon name={tab.icon as any} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
