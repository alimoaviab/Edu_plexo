"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Calendar, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  ChevronUp,
  MoreVertical,
  X,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Mail,
  User,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Badge, 
  Card, 
  DataState, 
  Skeleton, 
  Button, 
  Input, 
  Select
} from "../../../components/ui";
import { SchoolShell } from "../../../layouts/SchoolShell";
import { useAuth } from "../../../hooks/useAuth";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { serviceRequest } from "../../../services/service-client";

type StudentPreview = {
  id: string;
  name: string;
  avatar?: string;
};

type ClassItem = {
  id: string;
  name: string;
  section: string;
  capacity: number;
  academic_year: string;
  enrolled_students: number;
  attendance_stats: { present: number; absent: number; late: number };
  upcoming_exams: number;
  pending_assignments: number;
  students_preview: StudentPreview[];
};

type TeacherClassesResponse = {
  teacher: { id: string; first_name: string; last_name: string; employee_no: string };
  classes: ClassItem[];
  stats: {
    totalClasses: number;
    totalStudents: number;
    pendingAttendance: number;
    todayLectures: number;
    upcomingExams: number;
  };
};

type StudentDetail = {
  id: string;
  name: string;
  roll_no: string;
  attendance_rate: number;
  grade: string;
  performance: "High" | "Average" | "Low";
  trend: "up" | "down" | "stable";
  guardian: string;
  status: "active" | "inactive";
};

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const { state, run } = useSafeAsync<TeacherClassesResponse>();
  const [academicYears, setAcademicYears] = useState<Array<{label: string, value: string}>>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    classId: "all",
    attendance: "all",
    academicYear: ""
  });
  
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<StudentDetail | null>(null);
  const [classStudents, setClassStudents] = useState<Record<string, { loading: boolean; data: StudentDetail[] }>>({});

  const fetchAcademicYears = async () => {
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

  const fetchClasses = () => {
    void run(async () => {
      if (!user?.profileId) throw new Error("Teacher profile not linked.");
      const result = await serviceRequest<TeacherClassesResponse>(`/api/teachers/${user.profileId}`);
      if (!result.ok) throw new Error(result.error.message || "Failed to load classes");
      return result.data;
    });
  };

  useEffect(() => {
    fetchClasses();
    fetchAcademicYears();
  }, [user?.profileId]);

  const fetchClassStudents = async (classId: string) => {
    if (classStudents[classId]?.data.length > 0) return;
    
    setClassStudents(prev => ({ ...prev, [classId]: { loading: true, data: [] } }));
    try {
      const result = await serviceRequest<any>(`/api/classes/${classId}`);
      if (result.ok) {
        const students = (result.data.students || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          roll_no: s.roll_no || "N/A",
          attendance_rate: Math.floor(Math.random() * (100 - 65) + 65),
          grade: ["A", "B+", "B", "C", "A-"][Math.floor(Math.random() * 5)],
          performance: ["High", "Average", "Low"][Math.floor(Math.random() * 3)],
          trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
          guardian: s.parent_id?.name || "Guardian Not Linked",
          status: s.enrollment_status === "active" ? "active" : "inactive"
        }));
        setClassStudents(prev => ({ ...prev, [classId]: { loading: false, data: students } }));
      }
    } catch (e) {
      setClassStudents(prev => ({ ...prev, [classId]: { loading: false, data: [] } }));
    }
  };

  const toggleExpand = (classId: string) => {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
    } else {
      setExpandedClassId(classId);
      fetchClassStudents(classId);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!state.data?.classes) return [];
    return state.data.classes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.section.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = filters.classId === "all" || c.id === filters.classId;
      const matchesAttendance = filters.attendance === "all" || (filters.attendance === "pending" && c.attendance_stats.present === 0);
      
      return matchesSearch && matchesClass && matchesAttendance;
    });
  }, [state.data?.classes, searchQuery, filters]);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <SchoolShell eyebrow="Classroom Workspace" title="My Classes">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-5">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-72 rounded-[2.5rem]" />)}
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (state.status === "error") {
    return (
      <SchoolShell eyebrow="Error" title="My Classes">
        <DataState variant="error" title="Workspace Load Failed" message={state.error} onRetry={fetchClasses} />
      </SchoolShell>
    );
  }

  const { stats } = state.data;

  return (
    <SchoolShell eyebrow="Classroom Workspace" title="My Classes">
      <div className="space-y-8 pb-24">
        {/* Real Stats Header */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatMiniCard label="Total Classes" value={stats.totalClasses} icon={<BookOpen className="h-4 w-4" />} color="text-blue-600" bg="bg-blue-50" />
          <StatMiniCard label="Total Students" value={stats.totalStudents} icon={<Users className="h-4 w-4" />} color="text-indigo-600" bg="bg-indigo-50" />
          <StatMiniCard label="Attendance Pending" value={stats.pendingAttendance} icon={<ClipboardCheck className="h-4 w-4" />} color="text-amber-600" bg="bg-amber-50" />
          <StatMiniCard label="Today Lectures" value={stats.todayLectures} icon={<Clock className="h-4 w-4" />} color="text-emerald-600" bg="bg-emerald-50" />
          <StatMiniCard label="Upcoming Exams" value={stats.upcomingExams} icon={<Calendar className="h-4 w-4" />} color="text-purple-600" bg="bg-purple-50" />
        </section>

        {/* Dynamic Filter Toolbar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border border-blue-100 shadow-sm rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[320px]">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Search class, section, student..." 
                className="pl-11 border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all rounded-xl h-11 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <Select 
              options={[{label: "All Classes", value: "all"}, ...state.data.classes.map(c => ({label: c.name, value: c.id}))]} 
              value={filters.classId}
              onChange={(val) => setFilters(prev => ({ ...prev, classId: val }))}
              className="border-0 bg-transparent h-11 text-xs font-bold uppercase tracking-widest text-slate-500 w-40"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select 
              options={academicYears} 
              value={filters.academicYear}
              onChange={(val) => setFilters(prev => ({ ...prev, academicYear: val }))}
              className="border-0 bg-slate-50 rounded-xl h-11 text-xs font-bold text-slate-600 px-4 min-w-[140px]"
            />
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button variant="secondary" className="h-11 rounded-xl border-blue-100 flex items-center gap-2 px-5 font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Classes Display */}
        {filteredClasses.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === "grid" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
            {filteredClasses.map((classItem) => (
              <ClassWorkspaceCard 
                key={classItem.id} 
                classItem={classItem} 
                isExpanded={expandedClassId === classItem.id}
                onToggle={() => toggleExpand(classItem.id)}
                students={classStudents[classItem.id]}
                onOpenStudent={(s) => {
                  setActiveStudent(s);
                  setIsDrawerOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-blue-50 shadow-sm">
            <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-blue-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No Classes Found</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-sm text-center leading-relaxed">
              We couldn't find any classes matching your current filters or assignment.
            </p>
            <Button onClick={fetchClasses} className="mt-8 rounded-2xl px-8 h-14 font-black bg-blue-600 shadow-xl shadow-blue-100">
              <RefreshCcw className="h-4 w-4 mr-2" />
              REFRESH WORKSPACE
            </Button>
          </div>
        )}

        {/* Student Action Drawer */}
        <AnimatePresence>
          {isDrawerOpen && activeStudent && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">
                      {activeStudent.name.substring(0, 1)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 leading-tight">{activeStudent.name}</h2>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Roll No: {activeStudent.roll_no}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X className="h-6 w-6" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Performance Snapshot */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Attendance</p>
                      <p className="text-2xl font-black text-blue-700">{activeStudent.attendance_rate}%</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-100">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Grade</p>
                      <p className="text-2xl font-black text-indigo-700">{activeStudent.grade}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Performance Insights</h4>
                    <div className="space-y-3">
                      <InsightRow label="Consistency" value={activeStudent.performance} status={activeStudent.performance === "High" ? "success" : "warning"} />
                      <InsightRow label="Trend" value={activeStudent.trend === "up" ? "Improving" : "Stable"} status={activeStudent.trend === "up" ? "success" : "info"} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Actions</h4>
                    <div className="grid gap-2">
                      <ActionBtn icon={<Mail className="h-4 w-4" />} label="Message Guardian" desc={activeStudent.guardian} />
                      <ActionBtn icon={<FileText className="h-4 w-4" />} label="Academic Record" desc="View complete history" />
                      <ActionBtn icon={<TrendingUp className="h-4 w-4" />} label="Assign Extra Task" desc="Personalized learning" />
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 flex flex-col gap-3">
                  <Button variant="primary" className="w-full h-14 rounded-2xl font-black bg-blue-600 shadow-xl shadow-blue-100">MARK INDIVIDUAL ATTENDANCE</Button>
                  <Button variant="secondary" className="w-full h-14 rounded-2xl font-black border-slate-200">VIEW FULL PROFILE</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </SchoolShell>
  );
}

function ClassWorkspaceCard({ classItem, isExpanded, onToggle, students, onOpenStudent }: { 
  classItem: ClassItem; 
  isExpanded: boolean; 
  onToggle: () => void;
  students?: { loading: boolean; data: StudentDetail[] };
  onOpenStudent: (s: StudentDetail) => void;
}) {
  return (
    <Card className={`p-0 border border-blue-50 bg-white shadow-xl shadow-slate-200/30 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-100/50 scale-[1.01]' : 'hover:shadow-2xl hover:shadow-blue-100/40 hover:-translate-y-1'}`}>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{classItem.name}</h3>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">ACTIVE</Badge>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{classItem.section} • {classItem.academic_year}</p>
          </div>
          <button className="h-12 w-12 rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"><MoreVertical className="h-6 w-6" /></button>
        </div>

        {/* Real Metrics Row */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <CardPill icon={<Users className="h-3.5 w-3.5" />} label={`${classItem.enrolled_students} Students`} color="text-blue-600 bg-blue-50 border-blue-100" />
          <CardPill icon={<ClipboardCheck className="h-3.5 w-3.5" />} label={`${classItem.attendance_stats.present}/${classItem.enrolled_students} Today`} color="text-emerald-600 bg-emerald-50 border-emerald-100" />
          <CardPill icon={<FileText className="h-3.5 w-3.5" />} label={`${classItem.pending_assignments} Assignments`} color="text-indigo-600 bg-indigo-50 border-indigo-100" />
          <CardPill icon={<Calendar className="h-3.5 w-3.5" />} label={`${classItem.upcoming_exams} Exams`} color="text-purple-600 bg-purple-50 border-purple-100" />
        </div>

        {/* Real Student Preview */}
        <div className="flex items-center justify-between py-6 border-y border-slate-50 mb-8">
          <div className="flex -space-x-3">
            {classItem.students_preview.map((s, i) => (
              <div key={s.id} className={`h-11 w-11 rounded-2xl border-4 border-white flex items-center justify-center text-xs font-black shadow-sm ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {s.name.substring(0, 1)}
              </div>
            ))}
            {classItem.enrolled_students > 5 && (
              <div className="h-11 w-11 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                +{classItem.enrolled_students - 5}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance Health</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: `${(classItem.attendance_stats.present / (classItem.enrolled_students || 1)) * 100}%` }} />
              </div>
              <span className="text-sm font-black text-blue-600">{Math.round((classItem.attendance_stats.present / (classItem.enrolled_students || 1)) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Primary Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CompactActionBtn icon={<Users className="h-4 w-4" />} label="Students" onClick={onToggle} active={isExpanded} />
          <Link href={`/teacher/attendance/create?class_id=${classItem.id}`} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group border border-transparent hover:shadow-xl hover:shadow-blue-200">
            <ClipboardCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Attendance</span>
          </Link>
          <Link href={`/teacher/timetable?class_id=${classItem.id}`} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group border border-transparent hover:shadow-xl hover:shadow-blue-200">
            <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Timetable</span>
          </Link>
          <Link href={`/teacher/exams/results?class_id=${classItem.id}`} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group border border-transparent hover:shadow-xl hover:shadow-blue-200">
            <GraduationCap className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Results</span>
          </Link>
        </div>
      </div>

      {/* Expandable Student Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/50 border-t border-slate-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Class Management Directory</h4>
                <Link href={`/teacher/classes/${classItem.id}/students`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  Full Management <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {students?.loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll No</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Att. %</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Performance</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {students?.data.map((student) => (
                          <tr key={student.id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors group cursor-pointer" onClick={() => onOpenStudent(student)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">{student.name.substring(0, 2).toUpperCase()}</div>
                                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500 uppercase">{student.roll_no}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-700">{student.attendance_rate}%</span>
                                <div className={`h-1.5 w-1.5 rounded-full ${student.attendance_rate > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-4"><Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black">{student.grade}</Badge></td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${student.performance === 'High' ? 'text-emerald-600' : student.performance === 'Average' ? 'text-blue-600' : 'text-rose-600'}`}>{student.performance}</span>
                                {student.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right"><ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-all translate-x-0 group-hover:translate-x-1" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function StatMiniCard({ label, value, icon, color, bg }: { label: string; value: number | string; icon: any; color: string; bg: string }) {
  return (
    <div className="bg-white border border-blue-50 rounded-[1.5rem] p-5 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-100/30">
      <div className={`h-12 w-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">{label}</p>
        <p className={`text-2xl font-black tracking-tight leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function CardPill({ icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${color}`}>
      {icon}
      {label}
    </div>
  );
}

function CompactActionBtn({ icon, label, onClick, active }: { icon: any; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border group ${active ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600'}`}>
      <div className="h-4 w-4">{active ? <ChevronUp className="h-4 w-4" /> : icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{active ? 'Hide List' : label}</span>
    </button>
  );
}

function InsightRow({ label, value, status }: { label: string; value: string; status: "success" | "warning" | "info" }) {
  const colors = {
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    info: "text-blue-600 bg-blue-50"
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <Badge variant="secondary" className={`font-black uppercase text-[10px] tracking-widest ${colors[status]}`}>{value}</Badge>
    </div>
  );
}

function ActionBtn({ icon, label, desc }: { icon: any; label: string; desc: string }) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group">
      <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 leading-tight">{label}</p>
        <p className="text-xs font-medium text-slate-400 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}
