import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SchoolShell } from "@/layouts/SchoolShell";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { serviceRequest } from "@/services/service-client";
import { AppIcon } from "shared/ui/AppIcon";
import { showToast } from "@/utils/toast";

interface Announcement {
  _id: string;
  title: string;
  body: string;
  audience: string;
  priority: "low" | "normal" | "high" | "urgent";
  pinned_till?: string;
  created_at: string;
  created_by?: string;
  attachments?: string[];
}

interface ParsedAnnouncement extends Announcement {
  category: CategoryType;
  isRead: boolean;
  isPinned: boolean;
  attachments: string[];
}

type CategoryType = "Emergency" | "Academic" | "Fee" | "Holiday" | "Event" | "General";

interface CategoryConfigValue {
  label: string;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
}

const categoryConfig: Record<CategoryType, CategoryConfigValue> = {
  Emergency: {
    label: "Emergency Alert",
    icon: "AlertTriangle",
    badgeBg: "bg-red-50",
    badgeBorder: "border-red-100",
    badgeText: "text-red-700",
    iconBg: "bg-red-50 text-red-500",
    iconColor: "text-red-500",
  },
  Academic: {
    label: "Academic",
    icon: "GraduationCap",
    badgeBg: "bg-blue-50/70",
    badgeBorder: "border-blue-100/50",
    badgeText: "text-blue-750",
    iconBg: "bg-blue-50 text-blue-550",
    iconColor: "text-blue-600",
  },
  Fee: {
    label: "Fee & Billing",
    icon: "CreditCard",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-100",
    badgeText: "text-amber-700",
    iconBg: "bg-amber-50 text-amber-550",
    iconColor: "text-amber-600",
  },
  Holiday: {
    label: "School Holiday",
    icon: "Sun",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-100",
    badgeText: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-550",
    iconColor: "text-emerald-600",
  },
  Event: {
    label: "School Event",
    icon: "Calendar",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-100",
    badgeText: "text-purple-700",
    iconBg: "bg-purple-50 text-purple-555",
    iconColor: "text-purple-600",
  },
  General: {
    label: "General Update",
    icon: "Megaphone",
    badgeBg: "bg-blue-50/40",
    badgeBorder: "border-blue-100/40",
    badgeText: "text-blue-600",
    iconBg: "bg-gradient-to-tr from-blue-500/10 to-purple-500/10 text-blue-600",
    iconColor: "text-blue-650",
  },
};

export function ParentAnnouncementsPage() {
  const { selectedChild } = useSelectedChild();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Custom states
  const [selectedNotice, setSelectedNotice] = useState<ParsedAnnouncement | null>(null);
  const [readNotices, setReadNotices] = useState<string[]>([]);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [filterPinnedOnly, setFilterPinnedOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Load read state from localStorage
    const saved = localStorage.getItem("parent_read_announcements");
    if (saved) {
      try {
        setReadNotices(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!selectedChild) return;
      setLoading(true);
      try {
        const res = await serviceRequest<Announcement[]>("/api/parent/child/announcements");
        if (res.ok && res.data) {
          setAnnouncements(res.data);
        }
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchAnnouncements();
  }, [selectedChild]);

  // Helper to categorize based on content keywords
  const getCategory = (title: string, body: string): CategoryType => {
    const text = (title + " " + body).toLowerCase();
    if (text.includes("emergency") || text.includes("urgent") || text.includes("critical") || text.includes("severe") || text.includes("alert")) {
      return "Emergency";
    }
    if (text.includes("fee") || text.includes("invoice") || text.includes("payment") || text.includes("due") || text.includes("outstanding") || text.includes("billing")) {
      return "Fee";
    }
    if (text.includes("holiday") || text.includes("vacation") || text.includes("closed") || text.includes("off") || text.includes("break")) {
      return "Holiday";
    }
    if (text.includes("exam") || text.includes("test") || text.includes("syllabus") || text.includes("result") || text.includes("grade") || text.includes("assessment")) {
      return "Academic";
    }
    if (text.includes("event") || text.includes("celebration") || text.includes("party") || text.includes("sports") || text.includes("assembly") || text.includes("annual")) {
      return "Event";
    }
    return "General";
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (readNotices.includes(id)) return;
    const next = [...readNotices, id];
    setReadNotices(next);
    localStorage.setItem("parent_read_announcements", JSON.stringify(next));

    // Update selectedNotice state if currently viewing this item
    if (selectedNotice && selectedNotice._id === id) {
      setSelectedNotice({ ...selectedNotice, isRead: true });
    }
  };

  const handleMarkAllRead = () => {
    const allIds = announcements.map((a) => a._id);
    setReadNotices(allIds);
    localStorage.setItem("parent_read_announcements", JSON.stringify(allIds));
    showToast("All announcements marked as read.", "success");
  };

  // Parsed notices with category and computed metadata
  const parsedAnnouncements = useMemo<ParsedAnnouncement[]>(() => {
    return announcements.map((a) => ({
      ...a,
      category: getCategory(a.title, a.body),
      isRead: readNotices.includes(a._id),
      isPinned: a.pinned_till ? new Date(a.pinned_till) > new Date() : false,
      attachments: a.attachments || [],
    }));
  }, [announcements, readNotices]);

  // Derived statistics
  const stats = useMemo(() => {
    const total = announcements.length;
    const unread = parsedAnnouncements.filter((a) => !a.isRead).length;
    const important = parsedAnnouncements.filter(
      (a) => a.priority === "high" || a.priority === "urgent" || a.category === "Emergency"
    ).length;
    const thisWeek = announcements.filter((a) => {
      const diff = new Date().getTime() - new Date(a.created_at).getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    }).length;

    return { total, unread, important, thisWeek };
  }, [announcements, parsedAnnouncements]);

  // Filtered lists
  const filtered = useMemo(() => {
    return parsedAnnouncements.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const matchesUnread = !filterUnreadOnly || !a.isRead;
      const matchesPinned = !filterPinnedOnly || a.isPinned;
      return matchesSearch && matchesCategory && matchesUnread && matchesPinned;
    });
  }, [parsedAnnouncements, searchQuery, activeCategory, filterUnreadOnly, filterPinnedOnly]);

  // Timeline Date Grouping helper (Today, Yesterday, This Week, Older)
  const groupedTimeline = useMemo(() => {
    const groups: {
      today: ParsedAnnouncement[];
      yesterday: ParsedAnnouncement[];
      thisWeek: ParsedAnnouncement[];
      older: ParsedAnnouncement[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfThisWeek = new Date(startOfToday);
    startOfThisWeek.setDate(startOfThisWeek.getDate() - startOfThisWeek.getDay());

    filtered.forEach((a) => {
      const d = new Date(a.created_at);
      if (d >= startOfToday) {
        groups.today.push(a);
      } else if (d >= startOfYesterday) {
        groups.yesterday.push(a);
      } else if (d >= startOfThisWeek) {
        groups.thisWeek.push(a);
      } else {
        groups.older.push(a);
      }
    });

    return [
      { label: "Today", items: groups.today },
      { label: "Yesterday", items: groups.yesterday },
      { label: "This Week", items: groups.thisWeek },
      { label: "Older Notices", items: groups.older },
    ].filter((g) => g.items.length > 0);
  }, [filtered]);

  const handleShareNotice = (notice: Announcement) => {
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: notice.body,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${notice.title}\n\n${notice.body}`);
      showToast("Notice text copied to clipboard.", "success");
    }
  };

  const formatAuthor = (createdBy?: string) => {
    if (!createdBy) return "School Office";
    if (createdBy.toLowerCase() === "admin") return "School Principal";
    if (createdBy.includes("@")) return createdBy.split("@")[0];
    if (/^[0-9a-fA-F]{24}$/.test(createdBy) || createdBy.length > 15) {
      return "School Administration";
    }
    return createdBy;
  };

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Announcements Center">
      <div className="space-y-6 pb-10 max-w-5xl mx-auto px-4">
        
        {/* COMPACT BANNER HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 border border-blue-100/30 text-blue-600 flex items-center justify-center shadow-[0_2px_10px_rgba(59,130,246,0.03)] shrink-0">
                <AppIcon name="Megaphone" size={20} className="text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Institutional Announcements</h2>
                <p className="text-[11.5px] font-semibold text-slate-400">
                  Whole-school broadcast feed & bulletin board
                </p>
              </div>
            </div>

            {stats.unread > 0 && (
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="px-3 py-1 rounded-full bg-blue-50/50 text-blue-700 text-[11px] font-bold border border-blue-100/40">
                  {stats.unread} New Bulletin{stats.unread > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="h-9 px-4 rounded-xl border border-slate-200 hover:border-blue-200 text-[11px] font-bold text-slate-650 hover:text-blue-700 bg-white transition-all shadow-sm active:scale-[0.98]"
                >
                  Mark all read
                </button>
              </div>
            )}
          </div>
        </div>

        {/* STATISTICS TILES ROW (Compact & Visually Balanced) */}
        {!loading && announcements.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Bulletins",
                value: stats.total,
                icon: "Inbox",
                iconBg: "bg-blue-50/60 text-blue-600",
                iconColor: "text-blue-600",
              },
              {
                label: "New Unread",
                value: stats.unread,
                icon: "Bell",
                iconBg: stats.unread > 0 ? "bg-gradient-to-tr from-blue-500/10 to-purple-500/10 text-blue-600" : "bg-slate-50 text-slate-400",
                iconColor: stats.unread > 0 ? "text-blue-600" : "text-slate-400",
              },
              {
                label: "Important Alerts",
                value: stats.important,
                icon: "AlertTriangle",
                iconBg: stats.important > 0 ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400",
                iconColor: stats.important > 0 ? "text-red-500" : "text-slate-400",
              },
              {
                label: "Recent This Week",
                value: stats.thisWeek,
                icon: "Calendar",
                iconBg: "bg-emerald-50 text-emerald-600",
                iconColor: "text-emerald-600",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] hover:border-blue-100/60 hover:-translate-y-0.5 flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{s.value}</h4>
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.iconBg} transition-all duration-300 group-hover:scale-105 shadow-sm`}>
                  <AppIcon name={s.icon} size={16} className={s.iconColor} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEARCH AND FILTERS (Compact dashboard controls) */}
        <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.005)]">
          {/* Compact search bar */}
          <div className="relative">
            <AppIcon name="Search" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-11 rounded-xl bg-slate-50/40 border border-slate-200/60 text-xs font-semibold text-slate-705 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.005)]"
            />
          </div>

          {/* Category Chips and Toggles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {["All", "Emergency", "Academic", "Fee", "Holiday", "Event"].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`h-9 px-4 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-blue-200/80 shadow-sm"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-350 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Unread / Pinned Toggles (Compact) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                className={`h-9 px-4 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
                  filterUnreadOnly
                    ? "bg-blue-50 text-blue-600 border-blue-200/80 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${filterUnreadOnly ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`} />
                Unread Only
              </button>

              <button
                type="button"
                onClick={() => setFilterPinnedOnly(!filterPinnedOnly)}
                className={`h-9 px-4 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all duration-300 ${
                  filterPinnedOnly
                    ? "bg-blue-50 text-blue-600 border-blue-200/80 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                <AppIcon name="Pin" size={12} className={filterPinnedOnly ? "text-blue-600" : "text-slate-400"} />
                Pinned Only
              </button>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENTS CONTAINER */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Clean Empty State */
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.005)]">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
              <AppIcon name="Megaphone" size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No bulletins posted</h3>
            <p className="text-[12px] font-semibold text-slate-400 mt-1.5 max-w-sm">
              {searchQuery || activeCategory !== "All" || filterUnreadOnly || filterPinnedOnly
                ? "No matching announcements fit your active filter settings."
                : "The school administration has not posted any announcements yet."}
            </p>
            {(searchQuery || activeCategory !== "All" || filterUnreadOnly || filterPinnedOnly) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setFilterUnreadOnly(false);
                  setFilterPinnedOnly(false);
                }}
                className="mt-4 inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-md shadow-blue-500/10 transition-all active:scale-95"
              >
                <AppIcon name="Filter" size={12} />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTimeline.map((group) => (
              <div key={group.label} className="space-y-4 relative pl-5 sm:pl-6 ml-3 sm:ml-4">
                
                {/* Timeline Axis Line (Thin single pixel line) */}
                <div className="absolute left-0 top-2 bottom-0 border-l border-blue-100/40 pointer-events-none" />

                {/* Timeline Header Separator */}
                <div className="relative -left-[27px] sm:-left-[32px] flex items-center gap-2 mb-2 select-none">
                  <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-blue-50/20" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50/50 px-2.5 py-0.5 rounded-full border border-blue-100/40">
                    {group.label}
                  </span>
                </div>

                {/* Timeline Cards (Compact feed appearance) */}
                <div className="space-y-4">
                  {group.items.map((notice) => {
                    const config = categoryConfig[notice.category];
                    const isNew = !notice.isRead;
                    const formattedDate = new Date(notice.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={notice._id}
                        onClick={() => {
                          setSelectedNotice(notice);
                          handleMarkAsRead(notice._id);
                        }}
                        className={`group relative bg-white rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.025)] hover:border-blue-200/80 hover:-translate-y-0.5 cursor-pointer overflow-hidden p-5 sm:p-6 ${
                          isNew
                            ? "border-blue-100 ring-2 ring-blue-500/5 bg-gradient-to-br from-white to-blue-50/[0.01]"
                            : "border-slate-150"
                        }`}
                      >
                        {/* Timeline dot inside list items */}
                        <div className="absolute -left-[27px] sm:-left-[32px] top-8 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-2 ring-blue-50/30 transition-all duration-300 group-hover:scale-110" />

                        <div className="flex gap-4 items-start">
                          {/* Compact Icon Container */}
                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105 ${config.iconBg}`}>
                            <AppIcon
                              name={config.icon}
                              size={20}
                              className={config.iconColor}
                            />
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 space-y-2.5 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm ${config.badgeBg} ${config.badgeBorder} ${config.badgeText}`}>
                                  {config.label}
                                </span>

                                {notice.isPinned && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-50/70 border border-blue-100 text-blue-700 text-[9px] font-bold inline-flex items-center gap-1 shadow-sm">
                                    <AppIcon name="Pin" size={10} className="shrink-0" />
                                    Pinned
                                  </span>
                                )}

                                {notice.attachments && notice.attachments.length > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-550 text-[9px] font-bold inline-flex items-center gap-1 shadow-sm">
                                    <AppIcon name="Paperclip" size={10} className="shrink-0" />
                                    Attachment
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                <AppIcon name="Clock" size={12} className="shrink-0 text-slate-350" />
                                <span>{formattedDate}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-base font-bold text-slate-800 leading-snug tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                                {notice.title}
                              </h4>
                              <p className="text-[12.5px] text-slate-500 leading-relaxed font-semibold line-clamp-2">
                                {notice.body}
                              </p>
                            </div>

                            <div className="pt-2.5 flex items-center justify-between border-t border-slate-100/80">
                              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                <span className="text-slate-550">{formatAuthor(notice.created_by)}</span>
                                <span>•</span>
                                <span>Audience: {notice.audience || "All Parents"}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isNew && (
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                  </span>
                                )}
                                <span className="h-8.5 px-4 rounded-lg border border-blue-100 bg-blue-50/40 text-blue-700 text-[10px] font-bold flex items-center justify-center gap-1 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm active:scale-98">
                                  Read Notice
                                  <AppIcon name="ChevronRight" size={11} className="transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RIGHT SIDE DETAILS DRAWER */}
        <AnimatePresence>
          {selectedNotice && (
            <div className="fixed inset-0 z-50 flex justify-end items-end sm:items-start">
              {/* Backdrop with subtle dim and low blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNotice(null)}
                className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1.5px]"
              />

              {/* Panel container */}
              <motion.div
                initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
                animate={{ x: 0, y: 0 }}
                exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full sm:w-[460px] h-[85vh] sm:h-full bg-white shadow-2xl z-50 flex flex-col border-t sm:border-t-0 sm:border-l border-slate-100 rounded-t-2xl sm:rounded-t-none overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-sm ${categoryConfig[selectedNotice.category].badgeBg} ${categoryConfig[selectedNotice.category].badgeBorder} ${categoryConfig[selectedNotice.category].badgeText}`}>
                      <AppIcon name={categoryConfig[selectedNotice.category].icon} size={11} />
                      {categoryConfig[selectedNotice.category].label}
                    </span>
                    {selectedNotice.isPinned && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50/70 border border-blue-100 text-blue-700 text-[9px] font-bold inline-flex items-center gap-1 shadow-sm">
                        <AppIcon name="Pin" size={10} className="text-blue-650" />
                        Pinned Alert
                      </span>
                    )}
                    {selectedNotice.priority && selectedNotice.priority !== "normal" && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                        selectedNotice.priority === "high" || selectedNotice.priority === "urgent"
                          ? "bg-red-50 text-red-750 border-red-100"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      }`}>
                        {selectedNotice.priority}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNotice(null)}
                    className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-350 text-slate-500 bg-white hover:text-slate-950 transition-all shadow-sm active:scale-95"
                  >
                    <AppIcon name="X" size={14} />
                  </button>
                </div>

                {/* Scrollable details body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                  {/* Title & Metadata Block */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-800 leading-snug tracking-tight">
                      {selectedNotice.title}
                    </h3>
                    
                    {/* Inline metadata row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-450 bg-slate-50/40 p-3.5 rounded-xl border border-slate-100/60">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AppIcon name="Calendar" size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{new Date(selectedNotice.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AppIcon name="Clock" size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{new Date(selectedNotice.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AppIcon name="User" size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{formatAuthor(selectedNotice.created_by)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AppIcon name="Inbox" size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate uppercase text-[9px] font-bold">Scope: {selectedNotice.audience || "parents"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Formatted body */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[13px] text-slate-650 leading-relaxed whitespace-pre-wrap font-medium p-4 rounded-xl border border-slate-100 bg-white"
                  >
                    {selectedNotice.body ? (
                      selectedNotice.body
                    ) : (
                      <div className="py-8 text-center text-slate-400 italic font-medium text-xs">
                        No additional announcement content is available.
                      </div>
                    )}
                  </motion.div>

                  {/* Attachments Section */}
                  {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attachments</h4>
                      <div className="space-y-2">
                        {selectedNotice.attachments.map((url, idx) => {
                          const name = url.substring(url.lastIndexOf("/") + 1) || `attachment_${idx + 1}.pdf`;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 hover:border-blue-150 transition-all duration-300"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-blue-50/70 text-blue-600 flex items-center justify-center shrink-0">
                                  <AppIcon name="FileText" size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 truncate max-w-[180px]">{name}</span>
                              </div>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-7.5 px-3 rounded-lg border border-slate-200 hover:border-blue-200 text-[10px] font-bold text-slate-650 hover:text-blue-700 bg-white flex items-center justify-center gap-1 transition-all"
                              >
                                <AppIcon name="Download" size={11} />
                                Download
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Drawer Sticky Footer Actions */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(selectedNotice._id)}
                    className={`h-9 px-4 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      selectedNotice.isRead
                        ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 border-blue-100/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm"
                    }`}
                    disabled={selectedNotice.isRead}
                  >
                    <AppIcon name="Check" size={12} />
                    {selectedNotice.isRead ? "Read" : "Mark as read"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareNotice(selectedNotice)}
                      className="h-9 w-9 rounded-xl border border-slate-200 hover:border-slate-350 text-slate-600 bg-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
                      title="Share Notice"
                    >
                      <AppIcon name="Link" size={12} className="text-slate-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedNotice(null)}
                      className="h-9 px-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-md active:scale-95"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </SchoolShell>
  );
}

// Custom Skeleton Component for Announcements
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-6 space-y-4 overflow-hidden ${className}`}>
      <div className="flex items-center gap-3.5">
        <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-5 w-12 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-2/3 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-3 w-full bg-slate-100 rounded-md animate-pulse" />
        <div className="h-3 w-5/6 bg-slate-100 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default ParentAnnouncementsPage;
