import * as Icons from "lucide-react";

import React from "react";

interface Props extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: number;
  strokeWidth?: number;
}

// Comprehensive translation map from Google Material Icon strings to Lucide React component names
const materialToLucideMap: Record<string, string> = {
  // Navigation / Arrows
  arrow_back: "ArrowLeft",
  arrow_forward: "ArrowRight",
  arrow_upward: "ArrowUp",
  arrow_downward: "ArrowDown",
  chevron_left: "ChevronLeft",
  chevron_right: "ChevronRight",
  expand_more: "ChevronDown",
  arrow_drop_down: "ChevronDown",
  keyboard_arrow_down: "ChevronDown",
  keyboardarrowdown: "ChevronDown",
  keyboard_arrow_up: "ChevronUp",
  keyboardarrowup: "ChevronUp",
  keyboard_arrow_left: "ChevronLeft",
  keyboardarrowleft: "ChevronLeft",
  keyboard_arrow_right: "ChevronRight",
  keyboardarrowright: "ChevronRight",
  unfold_more: "ChevronsUpDown",
  menu: "Menu",
  close: "X",
  list: "List",
  view_list: "List",
  viewlist: "List",
  format_list_bulleted: "List",
  logout: "LogOut",
  login: "LogIn",
  external_link: "ExternalLink",
  link: "Link",
  add_link: "Link2",
  open_in_new: "ExternalLink",

  // Actions
  archive: "Archive",
  chat: "MessageSquare",
  forum: "MessageCircle",
  add: "Plus",
  add_circle: "PlusCircle",
  add_box: "PlusSquare",
  add_business: "Store",
  add_chart: "BarChart2",
  add_task: "ListPlus",
  add_photo_alternate: "ImagePlus",
  edit: "Pencil",
  edit_square: "SquarePen",
  edit_calendar: "CalendarDays",
  edit_note: "FileText",
  delete: "Trash2",
  delete_forever: "Trash2",
  delete_sweep: "Trash2",
  close_circle: "XCircle",
  cancel: "XCircle",
  save: "Save",
  download: "Download",
  download_for_offline: "Download",
  upload: "Upload",
  cloud_upload: "CloudUpload",
  search: "Search",
  search_off: "SearchX",
  filter_alt: "Filter",
  filter_alt_off: "FilterX",
  filter_list: "SlidersHorizontal",
  tune: "Sliders",
  refresh: "RefreshCw",
  autorenew: "RefreshCw",
  sync: "RefreshCw",
  restart_alt: "RotateCcw",
  print: "Printer",
  copy: "Copy",
  content_copy: "Copy",
  more_horiz: "MoreHorizontal",
  more_vert: "MoreVertical",
  label: "Tag",
  progress_activity: "Loader2",
  check: "Check",
  "check-circle": "CheckCircle2",
  check_circle: "CheckCircle2",
  task_alt: "CheckCircle2",
  verified: "CheckCircle",
  visibility: "Eye",
  visibility_off: "EyeOff",
  play_arrow: "Play",
  play_circle: "PlayCircle",
  stop: "Square",
  waving_hand: "Hand",

  // Academic / School
  school: "GraduationCap",
  graduation: "GraduationCap",
  class: "BookOpen",
  brain: "Brain",
  apartment: "Building2",
  business: "Building2",
  meeting_room: "DoorOpen",
  door_front: "DoorOpen",
  book: "BookOpen",
  book_open: "BookOpen",
  menu_book: "BookOpen",
  library_books: "Library",
  quiz: "HelpCircle",
  help: "HelpCircle",
  history_edu: "BookOpen",
  assignment: "FileText",
  assignment_late: "AlertTriangle",
  assignment_turned_in: "FileCheck",
  checklist: "ListTodo",
  clipboard: "Clipboard",
  badge: "Award",
  workspace_premium: "Award",
  score: "Trophy",
  family: "Users",
  family_restroom: "Users",
  group: "Users",
  groups: "Users",
  people: "Users",
  person: "User",
  person_add: "UserPlus",
  person_off: "UserMinus",
  user: "User",
  users: "Users",
  supervisor_account: "Users",
  manage_accounts: "UserCog",
  lock_person: "UserCheck",
  how_to_reg: "UserCheck",

  // General App / Tech
  title: "Type",
  dashboard: "LayoutDashboard",
  settings: "Settings",
  shield: "Shield",
  shield_lock: "ShieldAlert",
  smart_toy: "Bot",
  widgets: "Grid",
  grid_view: "LayoutGrid",
  inbox: "Inbox",
  info: "Info",
  error: "AlertCircle",
  warning: "AlertTriangle",
  report_problem: "AlertTriangle",
  priority_high: "AlertTriangle",
  notification_important: "AlertCircle",
  notifications: "Bell",
  bell: "Bell",
  calendar: "Calendar",
  calendar_month: "Calendar",
  calendar_today: "Calendar",
  calendar_add_on: "CalendarPlus",
  calendar_view_week: "CalendarDays",
  date_range: "Calendar",
  event: "Calendar",
  event_available: "CalendarCheck",
  event_busy: "CalendarX",
  event_note: "CalendarDays",
  today: "Calendar",
  upcoming: "CalendarDays",
  clock: "Clock",
  timer: "Clock",
  schedule: "Clock",
  time: "Clock",
  update: "Clock",
  history: "History",
  analytics: "BarChart3",
  insights: "TrendingUp",
  trending_up: "TrendingUp",
  trending_down: "TrendingDown",
  query_stats: "BarChart3",
  leaderboard: "BarChart3",
  image: "Image",
  video: "Video",
  video_camera_back: "Video",
  video_camera_front: "Video",
  videocam: "Video",
  videocam_off: "VideoOff",
  live_tv: "Tv",
  location_on: "MapPin",
  mail: "Mail",
  email: "Mail",
  alternate_email: "AtSign",
  call: "Phone",
  phone_enabled: "PhoneCall",
  campaign: "Megaphone",
  megaphone: "Megaphone",
  message: "MessageSquare",
  comment: "MessageSquare",
  notes: "StickyNote",
  rss_feed: "Rss",
  podcasts: "Podcast",
  play_circle_filled: "PlayCircle",
  
  // Finance / Health / Others
  payments: "CreditCard",
  account_balance_wallet: "Wallet",
  wallet: "Wallet",
  savings: "PiggyBank",
  account_balance: "Landmark",
  card_membership: "CreditCard",
  receipt_long: "Receipt",
  gavel: "Gavel",
  terminal: "Terminal",
  dns: "Database",
  db: "Database",
  security: "Shield",
  auto_awesome: "Sparkles",
  pending_actions: "Clock3",
  cloud_done: "CheckCircle2",
  refresh_ccw: "RefreshCcw",
  auto_fix_high: "Wand2",
  beach_access: "Umbrella",
  free_breakfast: "Coffee",
  medical_services: "HeartPulse",
  chemistry: "FlaskConical",
  experiment: "FlaskConical",
  labs: "FlaskConical",
  atom: "Atom",
  sparkles: "Sparkles",
  speed: "Gauge",
  star: "Star",
  stars: "Star",
  check_circle_outline: "CheckCircle",
  checklist_rtl: "ListTodo",
  fact_check: "CheckSquare",
  description: "FileText",
  file_text: "FileText",
  picture_as_pdf: "FileText",
  attachment: "Paperclip",
  attach_file: "Paperclip",
  hub: "Network",
  schema: "Network",
  language: "Globe",
  globe: "Globe",
  wifi_off: "WifiOff",
  cell_tower: "Radio"
};

const normalizeIconName = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

const normalizedLucideIconMap = Object.fromEntries(
  Object.keys(Icons).map((iconName) => [normalizeIconName(iconName), iconName])
) as Record<string, keyof typeof Icons>;

const normalizedMaterialToLucideMap = Object.fromEntries(
  Object.entries(materialToLucideMap).map(([key, value]) => [normalizeIconName(key), value])
) as Record<string, string>;

// Helper function to convert snake_case (common in Material Icons) to PascalCase (Lucide)
const snakeToPascal = (str: string): string => {
  return str
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

export const resolveAppIconName = (name: string): keyof typeof Icons | undefined => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return undefined;
  }

  if (trimmedName in Icons) {
    return trimmedName as keyof typeof Icons;
  }

  const normalizedName = normalizeIconName(trimmedName);
  const normalizedLucideName = normalizedLucideIconMap[normalizedName];
  if (normalizedLucideName) {
    return normalizedLucideName;
  }

  const mappedName = normalizedMaterialToLucideMap[normalizedName];
  if (mappedName) {
    const normalizedMappedName = normalizedLucideIconMap[normalizeIconName(mappedName)];
    return normalizedMappedName ?? (mappedName as keyof typeof Icons);
  }

  const pascalName = snakeToPascal(trimmedName);
  const normalizedPascalName = normalizedLucideIconMap[normalizeIconName(pascalName)];
  if (normalizedPascalName) {
    return normalizedPascalName;
  }

  return undefined;
};

export function AppIcon({
  name,
  size = 20,
  className = "",
  strokeWidth = 2,
  ...props
}: Props) {
  if (!name) {
    return null;
  }

  const resolvedName = resolveAppIconName(name);
  const Icon = resolvedName ? (Icons[resolvedName] as any) : undefined;

  if (!Icon) {
    console.warn("Missing icon mapping or Lucide icon:", name);
    // Render a fallback icon instead of crashing or showing text
    const FallbackIcon = Icons.HelpCircle as any;
    return <FallbackIcon size={size} className={className} strokeWidth={strokeWidth} />;
  }

  return (
    <Icon
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
