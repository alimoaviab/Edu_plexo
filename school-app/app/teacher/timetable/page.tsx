"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  CalendarDays,
  Search,
  Filter,
  RefreshCcw,
  BookOpen,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SchoolShell } from "../../../layouts/SchoolShell";
import { useAuth } from "../../../hooks/useAuth";
import { useTimetable } from "../../../modules/timetable/hooks/useTimetable";
import { 
  Card, 
  Badge, 
  Button, 
  Skeleton, 
  DataState, 
  Input, 
  Select 
} from "../../../components/ui";
import { getDayLabel, TimetableRecord } from "../../../modules/timetable/types/timetable.types";
import { serviceRequest } from "../../../services/service-client";

type ViewMode = "weekly" | "agenda" | "today";

export default function TeacherTimetablePage() {
  const { user } = useAuth();
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYears, setAcademicYears] = useState<Array<{label: string, value: string}>>([]);
  const [filters, setFilters] = useState({
    academicYear: "",
    classId: "all",
    subjectId: "all",
    day: "all"
  });

  // Data Fetching
  const timetableQuery = useMemo(() => ({
    teacher_id: user?.profileId,
    academic_year_id: filters.academicYear || undefined
  }), [user?.profileId, filters.academicYear]);

  const { state, refresh } = useTimetable(user?.profileId ? timetableQuery : undefined);

  // Fetch Academic Years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const result = await serviceRequest<any[]>("/api/academic-years");
        if (result.ok) {
          const years = result.data.map(y => ({ label: y.year, value: y.id }));
          setAcademicYears(years);
          if (years.length > 0 && !filters.academicYear) {
            setFilters(prev => ({ ...prev, academicYear: years.find(y => y.label.includes("2024"))?.value || years[0].value }));
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchYears();
  }, []);

  // Timetable Calculations
  const processedData = useMemo(() => {
    if (!state.data) return [];
    return state.data.filter(item => {
      const matchesSearch = item.class_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.room?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = filters.classId === "all" || item.class_id === filters.classId;
      const matchesSubject = filters.subjectId === "all" || item.subject_id === filters.subjectId;
      const matchesDay = filters.day === "all" || String(item.day_of_week) === filters.day;
      
      return matchesSearch && matchesClass && matchesSubject && matchesDay;
    });
  }, [state.data, searchQuery, filters]);

  // Derived Stats
  const stats = useMemo(() => {
    const today = new Date().getDay(); // 0 is Sunday
    const todayNum = today === 0 ? 7 : today;
    const todayClasses = processedData.filter(item => item.day_of_week === todayNum);
    
    return {
      todayCount: todayClasses.length,
      weeklyCount: processedData.length,
      uniqueSubjects: new Set(processedData.map(i => i.subject_id)).size,
      uniqueClasses: new Set(processedData.map(i => i.class_id)).size
    };
  }, [processedData]);

  // Current/Next Class Logic
  const liveSchedule = useMemo(() => {
    if (!state.data) return null;
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.getDay() === 0 ? 7 : now.getDay();

    const todaySchedule = state.data
      .filter(item => item.day_of_week === today)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    const current = todaySchedule.find(item => item.start_time <= currentTime && item.end_time >= currentTime);
    const next = todaySchedule.find(item => item.start_time > currentTime);

    return { current, next };
  }, [state.data]);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <SchoolShell eyebrow="Teacher Dashboard" title="My Timetable">
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-[2.5rem]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </div>
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Teacher Workspace" title="Timetable">
      <div className="space-y-8 pb-20">
        
        {/* Live Status Banner */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveClassWidget live={liveSchedule} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatSmallCard label="Today" value={stats.todayCount} sub="Classes" icon={<Calendar className="h-4 w-4" />} color="text-blue-600" bg="bg-blue-50" />
            <StatSmallCard label="Weekly" value={stats.weeklyCount} sub="Periods" icon={<Clock className="h-4 w-4" />} color="text-indigo-600" bg="bg-indigo-50" />
            <StatSmallCard label="Subjects" value={stats.uniqueSubjects} sub="Assigned" icon={<BookOpen className="h-4 w-4" />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatSmallCard label="Classes" value={stats.uniqueClasses} sub="Sections" icon={<Users className="h-4 w-4" />} color="text-purple-600" bg="bg-purple-50" />
          </div>
        </section>

        {/* Filters Toolbar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border border-blue-100 shadow-sm rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search subject, class or room..." 
                className="pl-11 border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <Select 
              options={academicYears} 
              value={filters.academicYear} 
              onChange={(val) => setFilters(prev => ({ ...prev, academicYear: val }))}
              className="border-0 bg-transparent h-11 text-xs font-bold text-slate-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <ViewToggle active={viewMode === "weekly"} onClick={() => setViewMode("weekly")} icon={<LayoutGrid className="h-4 w-4" />} label="Grid" />
              <ViewToggle active={viewMode === "agenda"} onClick={() => setViewMode("agenda")} icon={<List className="h-4 w-4" />} label="Agenda" />
              <ViewToggle active={viewMode === "today"} onClick={() => setViewMode("today")} icon={<CalendarDays className="h-4 w-4" />} label="Today" />
            </div>
            <Button variant="secondary" className="h-11 rounded-xl border-blue-100 font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Main Content View */}
        <AnimatePresence mode="wait">
          {processedData.length > 0 ? (
            <motion.div 
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === "weekly" && <WeeklyGridView data={processedData} />}
              {viewMode === "agenda" && <AgendaView data={processedData} />}
              {viewMode === "today" && <TodayView data={processedData} />}
            </motion.div>
          ) : (
            <EmptyScheduleState onRefresh={refresh} />
          )}
        </AnimatePresence>
      </div>
    </SchoolShell>
  );
}

function LiveClassWidget({ live }: { live: { current?: TimetableRecord, next?: TimetableRecord } | null }) {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Calendar className="h-32 w-32" />
      </div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-md mb-4 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
            {live?.current ? "Ongoing Session" : "Next Session"}
          </Badge>
          
          {live?.current ? (
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight">{live.current.subject_name}</h2>
              <div className="flex items-center gap-4 text-blue-100 font-bold">
                <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {live.current.class_name} {live.current.section}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Room {live.current.room}</div>
              </div>
            </div>
          ) : live?.next ? (
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight">{live.next.subject_name}</h2>
              <p className="text-blue-100 font-bold">Starts at {live.next.start_time}</p>
            </div>
          ) : (
            <h2 className="text-4xl font-black tracking-tight">No more classes today</h2>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          {live?.current && (
            <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-14 px-8 font-black shadow-lg shadow-black/10">
              TAKE ATTENDANCE <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          {live?.next && !live.current && (
            <p className="text-sm font-bold text-blue-100 italic">Preparing for next class...</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function WeeklyGridView({ data }: { data: TimetableRecord[] }) {
  const days = [1, 2, 3, 4, 5, 6];
  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  return (
    <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-slate-100 bg-slate-50/50">
            <div className="p-4"></div>
            {days.map(d => (
              <div key={d} className="p-4 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{getDayLabel(d)}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            {timeSlots.map((time, idx) => (
              <div key={time} className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-slate-50 last:border-0 min-h-[100px]">
                <div className="p-4 text-right border-r border-slate-50">
                  <span className="text-[10px] font-black text-slate-400">{time}</span>
                </div>
                {days.map(day => {
                  const items = data.filter(i => i.day_of_week === day && i.start_time.startsWith(time.split(":")[0]));
                  return (
                    <div key={day} className="p-2 border-r border-slate-50 last:border-0 relative">
                      {items.map(item => (
                        <PeriodCard key={item._id} item={item} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodCard({ item }: { item: TimetableRecord }) {
  // Simple color mapping based on subject
  const getSubjectColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("math")) return "bg-blue-50 text-blue-600 border-blue-100";
    if (n.includes("sci") || n.includes("phy") || n.includes("che") || n.includes("bio")) return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (n.includes("eng")) return "bg-indigo-50 text-indigo-600 border-indigo-100";
    if (n.includes("comp") || n.includes("it")) return "bg-violet-50 text-violet-600 border-violet-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-3 rounded-2xl border ${getSubjectColor(item.subject_name)} h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all group cursor-pointer`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest">{item.start_time} - {item.end_time}</span>
          <MoreVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h4 className="text-sm font-black tracking-tight leading-tight mb-1">{item.subject_name}</h4>
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{item.class_name} {item.section}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" /> Room {item.room}
        </span>
      </div>
    </motion.div>
  );
}

function AgendaView({ data }: { data: TimetableRecord[] }) {
  const grouped = useMemo(() => {
    const res: Record<number, TimetableRecord[]> = {};
    data.forEach(item => {
      if (!res[item.day_of_week]) res[item.day_of_week] = [];
      res[item.day_of_week].push(item);
    });
    return Object.entries(res).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [data]);

  return (
    <div className="space-y-6">
      {grouped.map(([day, items]) => (
        <div key={day} className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-3">
            {getDayLabel(Number(day))}
            <div className="h-px flex-1 bg-slate-100" />
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map(item => (
              <AgendaCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgendaCard({ item }: { item: TimetableRecord }) {
  return (
    <Card className="p-6 border-0 bg-white shadow-xl shadow-slate-200/30 rounded-3xl group hover:border-blue-200 hover:shadow-blue-100 transition-all border border-transparent">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-inner">
          {item.subject_name.substring(0, 1)}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.subject_name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.class_name} • Section {item.section}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-900 leading-none">{item.start_time}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{item.end_time}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <MapPin className="h-3.5 w-3.5" /> Room {item.room}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100">Details</Button>
          <Button className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 shadow-lg shadow-blue-100">Attend</Button>
        </div>
      </div>
    </Card>
  );
}

function TodayView({ data }: { data: TimetableRecord[] }) {
  const today = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayClasses = useMemo(() => {
    return data.filter(item => item.day_of_week === today).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [data, today]);

  if (todayClasses.length === 0) {
    return <EmptyScheduleState onRefresh={() => {}} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-200">
          {todayClasses.length}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Lectures</h3>
          <p className="text-slate-500 font-medium">{getDayLabel(today)}, {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {todayClasses.map((item, idx) => (
          <div key={item._id} className="relative pl-14 group">
            <div className="absolute left-[21px] top-4 h-2.5 w-2.5 rounded-full bg-white border-2 border-blue-600 group-hover:scale-150 transition-transform shadow-sm z-10" />
            <Card className="p-6 border border-slate-50 bg-white shadow-lg shadow-slate-200/30 rounded-[2rem] hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-black">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.subject_name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.class_name} {item.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 leading-none flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-600" /> {item.start_time}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{item.room}</p>
                  </div>
                  <Button className="rounded-2xl h-12 px-6 font-black bg-blue-600 shadow-lg shadow-blue-100">START</Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatSmallCard({ label, value, sub, icon, color, bg }: { label: string; value: number | string; sub: string; icon: any; color: string; bg: string }) {
  return (
    <div className="bg-white border border-blue-50 rounded-2xl p-4 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
      <div className={`h-8 w-8 rounded-xl ${bg} ${color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black tracking-tight ${color}`}>{value}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{sub}</span>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${active ? "bg-white text-blue-600 shadow-sm font-black" : "text-slate-400 font-bold"}`}
    >
      {icon}
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function EmptyScheduleState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-blue-50">
      <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
        <Calendar className="h-10 w-10 text-blue-300" />
        <div className="absolute -top-1 -right-1 h-8 w-8 bg-white shadow-lg rounded-full flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-amber-500 animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-900">No Schedule Assigned Yet</h3>
      <p className="text-slate-500 mt-3 font-medium max-w-sm text-center leading-relaxed">
        Your school administrator has not assigned your timetable periods yet. Please contact management for access.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={onRefresh} className="rounded-2xl px-8 h-14 font-black bg-blue-600 shadow-xl shadow-blue-100">
          <RefreshCcw className="h-4 w-4 mr-2" /> REFRESH
        </Button>
        <Button variant="secondary" className="rounded-2xl px-8 h-14 font-black border-slate-200">
          CONTACT ADMIN
        </Button>
      </div>
    </div>
  );
}

function MoreVertical(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
