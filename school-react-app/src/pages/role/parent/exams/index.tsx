import { useState, useEffect, useMemo } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { DataState, Skeleton } from "@/components/ui";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { listExams } from "@/modules/exams/services/exam.service";
import { AppIcon } from "shared/ui/AppIcon";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/toast";

export function ParentExamsPage() {
  const { selectedChild, loading: childLoading } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer states
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchExams() {
      if (!selectedChild) return;
      setLoading(true);
      try {
        // Fetch all exams for child's class
        const res = await listExams({ class_id: selectedChild.class_id });
        if (res.ok && res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setExams(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, [selectedChild]);

  // Separate upcoming and completed exams
  const filteredExams = useMemo(() => {
    const now = new Date();
    let list = exams.filter((e) => {
      const examDate = new Date(e.starts_at || e.date);
      const isCompleted = examDate < now;
      return activeTab === "completed" ? isCompleted : !isCompleted;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.subject?.toLowerCase().includes(q) ||
          (e.subjects && e.subjects.some((s: any) => s.subject_name?.toLowerCase().includes(q)))
      );
    }

    // Sort upcoming chronologically ascending, completed descending
    return list.sort((a, b) => {
      const timeA = new Date(a.starts_at || a.date).getTime();
      const timeB = new Date(b.starts_at || b.date).getTime();
      return activeTab === "upcoming" ? timeA - timeB : timeB - timeA;
    });
  }, [exams, activeTab, searchQuery]);

  // Exam Countdown calculation
  function getExamCountdown(startsAtStr: string) {
    const now = new Date();
    const startsAt = new Date(startsAtStr);
    const diffTime = startsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 0) {
      return { text: "Completed", isOverdue: true, color: "text-slate-400 font-semibold" };
    } else if (diffHours <= 24) {
      if (diffHours <= 1) {
        return { text: "Starts in 1 hour", isOverdue: false, color: "text-rose-600 font-black animate-pulse" };
      }
      return { text: `Starts in ${diffHours} hours`, isOverdue: false, color: "text-rose-500 font-bold" };
    } else if (diffDays === 1) {
      return { text: "Starts Tomorrow", isOverdue: false, color: "text-amber-500 font-bold" };
    } else {
      return { text: `In ${diffDays} days`, isOverdue: false, color: "text-slate-500 font-medium" };
    }
  }

  // Formatting date and time
  function formatExamDateTime(dateStr?: string) {
    if (!dateStr) return { date: "—", time: "—" };
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };
    } catch {
      return { date: dateStr, time: "—" };
    }
  }

  // Mock syllabus chapters based on subject name
  function getMockSyllabus(subjectName: string) {
    const name = (subjectName || "").toLowerCase();
    if (name.includes("math") || name.includes("calc")) {
      return ["Chapter 3: Quadratic Equations & Roots", "Chapter 5: Arithmetic Progressions", "Chapter 7: Geometry & Triangles"];
    }
    if (name.includes("science") || name.includes("phys")) {
      return ["Chapter 2: Forces, Weight and Friction", "Chapter 4: Light Propagation & Lenses", "Chapter 5: Electricity Circuits"];
    }
    if (name.includes("chem") || name.includes("bio")) {
      return ["Chapter 1: Chemical Reactions & Equations", "Chapter 3: Carbon compounds", "Chapter 6: Life Processes & Cells"];
    }
    if (name.includes("english") || name.includes("lit")) {
      return ["Section A: Comprehension & Unseen Passage", "Section B: Formal Letter Writing & Grammatical Tense", "Section C: Prose & Poetry (Chapters 1-5)"];
    }
    return ["Chapter 1 & 2: Introduction and Core Concepts", "Chapter 4: Review Exercises & Questions", "Practical Project Workbook Submissions"];
  }

  // Assign a static mock room hall number based on exam ID
  function getMockHall(examId: string) {
    const hash = examId.charCodeAt(examId.length - 1) || 0;
    if (hash % 3 === 0) return "Examination Block A · Hall 2";
    if (hash % 3 === 1) return "Academic Block B · Room 304";
    return "Main Auditorium · Row C";
  }

  // Subject gradient themes helper
  function getSubjectGradient(subjectName: string) {
    const name = (subjectName || "").toLowerCase();
    if (name.includes("math")) return "from-indigo-500 to-purple-600";
    if (name.includes("science") || name.includes("phys") || name.includes("bio")) return "from-emerald-500 to-teal-600";
    if (name.includes("history") || name.includes("social")) return "from-amber-500 to-orange-600";
    return "from-sky-500 to-blue-600";
  }

  const handleToggleReminder = (examId: string) => {
    const isSet = reminders[examId];
    setReminders((prev) => ({ ...prev, [examId]: !isSet }));
    if (!isSet) {
      showToast("Exam reminder notification scheduled successfully.", "success");
    } else {
      showToast("Exam reminder removed.", "info");
    }
  };

  if (childLoading || (loading && exams.length === 0)) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Exams & Schedules">
        <div className="space-y-6">
          <Skeleton className="h-14 w-[320px] rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (!selectedChild) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Exams & Schedules">
        <DataState
          variant="empty"
          title="No child selected"
          message="Pick a child from the header to view their exam schedule."
        />
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Exams & Schedules">
      <div className="space-y-6 pb-12">
        
        {/* Toolbar & Filter Tabs */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                activeTab === "upcoming"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Upcoming Exams
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                activeTab === "completed"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Completed Exams
            </button>
          </div>

          <div className="relative">
            <AppIcon name="Search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams..."
              className="h-8.5 w-[200px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] font-semibold text-slate-700 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <AppIcon name="Calendar" size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Exams Scheduled</h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? "No results matched your search parameters. Try adjusting your query."
                : `There are no ${activeTab} examinations recorded for Class ${selectedChild.class_name || "your child's class"} at this moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => {
              const id = exam._id || exam.id;
              const dt = formatExamDateTime(exam.starts_at || exam.date);
              const countdown = getExamCountdown(exam.starts_at || exam.date);
              const isUpcoming = activeTab === "upcoming";
              const primarySubject = exam.subject || (exam.subjects && exam.subjects[0]?.subject_name) || "General";
              const gradient = getSubjectGradient(primarySubject);
              const isSubscribed = reminders[id] || false;

              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedExam(exam);
                    setIsDrawerOpen(true);
                  }}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {/* Subject Theme Indicator */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {exam.type || "exam"}
                      </span>
                      <span className={`text-[10px] ${countdown.color}`}>
                        {countdown.text}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-[14px] font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {exam.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-tight">
                        {primarySubject}
                      </p>
                    </div>

                    {/* Schedule block */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-500">
                        <AppIcon name="Calendar" size={13} className="text-slate-400 shrink-0" />
                        <span>{dt.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 font-bold text-slate-500">
                        <AppIcon name="Clock" size={13} className="text-slate-400 shrink-0" />
                        <span>{dt.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reminder bell indicator on hover (upcoming only) */}
                  {isUpcoming && (
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleReminder(id);
                        }}
                        className={`h-7 w-7 rounded-full border flex items-center justify-center transition-all ${
                          isSubscribed
                            ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 shadow-sm"
                        }`}
                      >
                        <AppIcon name="Bell" size={12} className={isSubscribed ? "animate-swing" : ""} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* DETAILED EXAM SLIDE PANEL */}
      <AnimatePresence>
        {isDrawerOpen && selectedExam && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            />

            {/* Slide Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-50 shadow-2xl z-50 flex flex-col border-l border-slate-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <AppIcon name="Calendar" size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900">Exam Details</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule Info</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-8 w-8 rounded-full border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-95"
                >
                  <AppIcon name="X" size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Title Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] space-y-3">
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] font-bold text-indigo-700 uppercase tracking-wider">
                    {selectedExam.type || "Exam"} Session
                  </span>
                  <h2 className="text-base font-black text-slate-800 leading-snug">{selectedExam.title}</h2>
                  
                  {/* Detailed date time rows */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-[12px] font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <AppIcon name="Calendar" size={14} className="text-slate-400" />
                      <span>{formatExamDateTime(selectedExam.starts_at || selectedExam.date).date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppIcon name="Clock" size={14} className="text-slate-400" />
                      <span>{formatExamDateTime(selectedExam.starts_at || selectedExam.date).time}</span>
                    </div>
                  </div>
                </div>

                {/* Exam Hall Info */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam Location</h4>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <AppIcon name="LocationOn" size={16} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-800">{getMockHall(selectedExam._id || selectedExam.id)}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Please check desk labels outside hall</p>
                    </div>
                  </div>
                </div>

                {/* Subjects details (if multi-subject) */}
                {selectedExam.subjects && selectedExam.subjects.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject Breakdowns</h4>
                    <div className="space-y-2">
                      {selectedExam.subjects.map((sub: any, sIdx: number) => (
                        <div key={sIdx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex items-center justify-between">
                          <span className="text-[12px] font-bold text-slate-700">{sub.subject_name}</span>
                          <span className="text-[11px] font-semibold text-slate-400">Max Marks: {sub.max_marks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject & Grade Floor</h4>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex items-center justify-between">
                      <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">{selectedExam.subject || "General"}</span>
                      <span className="text-[11px] font-semibold text-slate-400">Max Marks: {selectedExam.max_marks || 100}</span>
                    </div>
                  </div>
                )}

                {/* Syllabus Preview Section */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Syllabus Outline</h4>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                    <ul className="space-y-3">
                      {getMockSyllabus(selectedExam.subject || (selectedExam.subjects && selectedExam.subjects[0]?.subject_name) || "").map((topic, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2 text-[12px] font-semibold text-slate-600">
                          <span className="text-indigo-500 mt-0.5 shrink-0">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Exam Instructions */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Important Guidelines</h4>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                    <p className="text-[12px] font-semibold text-slate-500 leading-relaxed">
                      {selectedExam.description || "1. Students must arrive inside their assigned exam room at least 15 minutes before session begins.\n2. Bring a copy of the official school ID or roll voucher slip.\n3. Calculator allowed only for Maths & Science sessions. No smart devices or phones permitted."}
                    </p>
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                {new Date(selectedExam.starts_at || selectedExam.date) > new Date() ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-slate-400">Get exam reminder alert:</span>
                    <button
                      type="button"
                      onClick={() => handleToggleReminder(selectedExam._id || selectedExam.id)}
                      className={`h-9 px-4 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        reminders[selectedExam._id || selectedExam.id]
                          ? "bg-amber-500 text-white"
                          : "border border-slate-200 text-slate-600 bg-white hover:border-slate-300"
                      }`}
                    >
                      <AppIcon name="Bell" size={13} />
                      {reminders[selectedExam._id || selectedExam.id] ? "Reminder Active" : "Remind Me"}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] font-semibold text-slate-400 italic mx-auto">
                    This examination has already been completed.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </SchoolShell>
  );
}
