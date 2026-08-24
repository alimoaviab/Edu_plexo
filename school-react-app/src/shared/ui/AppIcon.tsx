import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Atom,
  Award,
  BarChart2,
  BarChart3,
  Bell,
  Book,
  BookOpen,
  Bot,
  Brain,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  CalendarX2,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Clipboard,
  ClipboardCheck,
  Clock,
  Clock3,
  CloudUpload,
  Coffee,
  Copy,
  CreditCard,
  Database,
  DoorOpen,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileDown,
  FileQuestion,
  FileText,
  Filter,
  FilterX,
  FlaskConical,
  Gauge,
  Gavel,
  GitBranch,
  Globe,
  GraduationCap,
  Grid,
  Hand,
  HeartPulse,
  HelpCircle,
  History,
  Image,
  ImagePlus,
  Inbox,
  Info,
  Landmark,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Library,
  Lightbulb,
  Link,
  Link2,
  List,
  ListPlus,
  ListTodo,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Network,
  Palette,
  Paperclip,
  PenTool,
  Pencil,
  Phone,
  PhoneCall,
  PiggyBank,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  PlusSquare,
  Podcast,
  Printer,
  Radio,
  Receipt,
  RefreshCcw,
  RefreshCw,
  RotateCcw,
  Rss,
  Save,
  Search,
  SearchX,
  Send,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquarePen,
  Star,
  StickyNote,
  Store,
  Sun,
  SunMedium,
  Laptop,
  Tag,
  Terminal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Tv,
  Type,
  Umbrella,
  Upload,
  User,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Video,
  VideoOff,
  Wallet,
  Wand2,
  WifiOff,
  X,
  XCircle,
  Zap,
} from "lucide-react";

interface Props extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: number;
  strokeWidth?: number;
  colorful?: boolean;
  withContainer?: boolean;
}

const iconRegistry = {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Atom,
  Award,
  BarChart2,
  BarChart3,
  Bell,
  Book,
  BookOpen,
  Bot,
  Brain,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  CalendarX2,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Clipboard,
  ClipboardCheck,
  Clock,
  Clock3,
  CloudUpload,
  Coffee,
  Copy,
  CreditCard,
  Database,
  DoorOpen,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileDown,
  FileQuestion,
  FileText,
  Filter,
  FilterX,
  FlaskConical,
  Gauge,
  Gavel,
  GitBranch,
  Globe,
  GraduationCap,
  Grid,
  Hand,
  HeartPulse,
  HelpCircle,
  History,
  Image,
  ImagePlus,
  Inbox,
  Info,
  Landmark,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Library,
  Lightbulb,
  Link,
  Link2,
  List,
  ListPlus,
  ListTodo,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Network,
  Palette,
  Paperclip,
  PenTool,
  Pencil,
  Phone,
  PhoneCall,
  PiggyBank,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  PlusSquare,
  Podcast,
  Printer,
  Radio,
  Receipt,
  RefreshCcw,
  RefreshCw,
  RotateCcw,
  Rss,
  Save,
  Search,
  SearchX,
  Send,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquarePen,
  Star,
  StickyNote,
  Store,
  Sun,
  SunMedium,
  Laptop,
  Tag,
  Terminal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Tv,
  Type,
  Umbrella,
  Upload,
  User,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  Video,
  VideoOff,
  Wallet,
  Wand2,
  WifiOff,
  X,
  XCircle,
  Zap,
} satisfies Record<string, LucideIcon>;

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
  domain: "Globe",
  palette: "Palette",
  hourglass_empty: "Hourglass",
  cell_tower: "Radio"
};

const normalizeIconName = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

const normalizedLucideIconMap = Object.fromEntries(
  Object.keys(iconRegistry).map((iconName) => [normalizeIconName(iconName), iconName])
) as Record<string, keyof typeof iconRegistry>;

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

export const resolveAppIconName = (name: string): keyof typeof iconRegistry | undefined => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return undefined;
  }

  if (trimmedName in iconRegistry) {
    return trimmedName as keyof typeof iconRegistry;
  }

  const normalizedName = normalizeIconName(trimmedName);
  const normalizedLucideName = normalizedLucideIconMap[normalizedName];
  if (normalizedLucideName) {
    return normalizedLucideName;
  }

  const mappedName = normalizedMaterialToLucideMap[normalizedName];
  if (mappedName) {
    const normalizedMappedName = normalizedLucideIconMap[normalizeIconName(mappedName)];
    return normalizedMappedName ?? (mappedName as keyof typeof iconRegistry);
  }

  const pascalName = snakeToPascal(trimmedName);
  const normalizedPascalName = normalizedLucideIconMap[normalizeIconName(pascalName)];
  if (normalizedPascalName) {
    return normalizedPascalName;
  }

  return undefined;
};

type IconColorTheme = { text: string; bg: string };

const colorThemes: Record<string, IconColorTheme> = {
  blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  indigo: { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
  purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
  violet: { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  pink: { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/30" },
  rose: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/30" },
  red: { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
  orange: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
  amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  yellow: { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/30" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  green: { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
  teal: { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30" },
  cyan: { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-900/30" },
  slate: { text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/30" },
  multicolor: { text: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30" },
};

const getIconTheme = (name: string): IconColorTheme => {
  const n = name.toLowerCase();
  
  if (n.includes("dashboard") || n.includes("layout")) return colorThemes.indigo;
  if (n.includes("school") || n.includes("building") || n.includes("domain") || n.includes("globe")) return colorThemes.cyan;
  if (n.includes("subscription") || n.includes("card") || n.includes("credit")) return colorThemes.purple;
  if (n.includes("academic") || n.includes("year")) return colorThemes.violet;
  if (n.includes("class") || n.includes("book") || n.includes("library") || n.includes("cap")) return colorThemes.orange;
  if (n.includes("teacher") || n.includes("chalkboard")) return colorThemes.emerald;
  if (n.includes("student") || n.includes("user")) return colorThemes.blue;
  if (n.includes("leave") || n.includes("busy") || n.includes("off") || n.includes("minus")) return colorThemes.rose;
  if (n.includes("behavior") || n.includes("gavel") || n.includes("alert")) return colorThemes.pink;
  if (n.includes("timetable") || n.includes("schedule") || n.includes("clock") || n.includes("calendar")) return colorThemes.cyan;
  if (n.includes("attendance") || n.includes("check") || n.includes("fact")) return colorThemes.green;
  if (n.includes("homework") || n.includes("assignment") || n.includes("file")) return colorThemes.amber;
  if (n.includes("exam") || n.includes("quiz") || n.includes("help") || n.includes("question")) return colorThemes.purple;
  if (n.includes("test")) return colorThemes.blue;
  if (n.includes("result") || n.includes("trophy") || n.includes("award") || n.includes("leaderboard")) return colorThemes.teal;
  if (n.includes("live") || n.includes("video") || n.includes("cam") || n.includes("tv")) return colorThemes.blue;
  if (n.includes("announcement") || n.includes("campaign") || n.includes("megaphone") || n.includes("bell") || n.includes("horn")) return colorThemes.orange;
  if (n.includes("certificate") || n.includes("premium")) return colorThemes.yellow;
  if (n.includes("template") || n.includes("design") || n.includes("palette") || n.includes("sparkles")) return colorThemes.multicolor;
  if (n.includes("fee") || n.includes("receipt") || n.includes("payment") || n.includes("wallet") || n.includes("bank") || n.includes("landmark")) return colorThemes.purple;
  if (n.includes("conversation") || n.includes("message") || n.includes("chat") || n.includes("mail")) return colorThemes.cyan;
  if (n.includes("setting") || n.includes("slider") || n.includes("cog")) return colorThemes.slate;
  if (n.includes("delete") || n.includes("trash") || n.includes("x")) return colorThemes.red;
  if (n.includes("edit") || n.includes("pen") || n.includes("update")) return colorThemes.amber;
  if (n.includes("add") || n.includes("plus") || n.includes("new")) return colorThemes.emerald;
  if (n.includes("search") || n.includes("filter")) return colorThemes.slate;

  return colorThemes.slate;
};

export function AppIcon({
  name,
  size = 20,
  className = "",
  strokeWidth = 2,
  colorful = true,
  withContainer = false,
  ...props
}: Props) {
  if (!name) {
    return null;
  }

  const resolvedName = resolveAppIconName(name);
  const Icon = resolvedName ? iconRegistry[resolvedName] : undefined;

  if (!Icon) {
    if (import.meta.env.DEV) {
      console.warn("Missing icon mapping or Lucide icon:", name);
    }
    const FallbackIcon = HelpCircle;
    return <FallbackIcon size={size} className={className} strokeWidth={strokeWidth} />;
  }

  const isExplicitlyWhite = className.includes("text-white") || className.includes("text-slate-50") || className.includes("text-[#");
  const isExplicitlyColored = className.includes("text-blue-") || className.includes("text-green-") || className.includes("text-red-") || className.includes("text-amber-") || className.includes("text-indigo-") || className.includes("text-emerald-") || className.includes("text-rose-");

  let activeClassName = className;

  if (colorful && !isExplicitlyWhite && !isExplicitlyColored) {
    const theme = getIconTheme(resolvedName || name);
    
    activeClassName = activeClassName
      .replace(/\btext-slate-[0-9]{3}\b/g, "")
      .replace(/\btext-text-(muted|secondary|primary)\b/g, "")
      .replace(/\btext-gray-[0-9]{3}\b/g, "")
      .trim();

    activeClassName = `${theme.text} ${activeClassName}`.trim();
    
    if (withContainer) {
      return (
        <div className={`inline-flex items-center justify-center p-2 rounded-lg ${theme.bg}`}>
          <Icon size={size} className={activeClassName} strokeWidth={strokeWidth} {...props} />
        </div>
      );
    }
  }

  return (
    <Icon
      size={size}
      className={activeClassName}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
