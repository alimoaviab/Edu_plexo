import { useState, useEffect, useMemo } from "react";
import { SchoolShell } from "@/layouts/SchoolShell";
import { DataState, Skeleton } from "@/components/ui";
import { useSelectedChild } from "@/contexts/SelectedChildContext";
import { listResults } from "@/modules/results/services/result.service";
import { AppIcon } from "shared/ui/AppIcon";
import { motion, AnimatePresence } from "framer-motion";

export function ParentResultsPage() {
  const { selectedChild, loading: childLoading } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      if (!selectedChild) return;
      setLoading(true);
      try {
        const res = await listResults({ student_id: selectedChild.student_id });
        if (res.ok && res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setResults(list);
          if (list.length > 0) {
            setSelectedExamId(list[0].exam_id || list[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [selectedChild]);

  // Selected Result computations
  const selectedResult = useMemo(() => {
    return results.find((r) => r.exam_id === selectedExamId || r._id === selectedExamId) || null;
  }, [results, selectedExamId]);

  // Overall calculations across all exams
  const summaryMetrics = useMemo(() => {
    if (results.length === 0) return { gpa: "—", percentage: 0, grade: "—", totalExams: 0 };
    
    let totalObtained = 0;
    let totalMax = 0;
    results.forEach((r) => {
      totalObtained += r.obtained_marks || 0;
      totalMax += r.max_marks || 0;
    });

    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    
    // Compute GPA from percentage (4.0 scale)
    let gpa = "4.0";
    let grade = "A+";
    if (percentage >= 90) { gpa = "3.9"; grade = "A+"; }
    else if (percentage >= 85) { gpa = "3.7"; grade = "A"; }
    else if (percentage >= 80) { gpa = "3.5"; grade = "A-"; }
    else if (percentage >= 75) { gpa = "3.2"; grade = "B+"; }
    else if (percentage >= 70) { gpa = "3.0"; grade = "B"; }
    else if (percentage >= 65) { gpa = "2.7"; grade = "B-"; }
    else if (percentage >= 60) { gpa = "2.3"; grade = "C+"; }
    else if (percentage >= 50) { gpa = "2.0"; grade = "C"; }
    else { gpa = "1.5"; grade = "D/F"; }

    return {
      gpa,
      percentage: Math.round(percentage * 10) / 10,
      grade,
      totalExams: results.length,
    };
  }, [results]);

  // Subject Performance helper
  const subjectList = useMemo(() => {
    if (!selectedResult) return [];
    return selectedResult.subjects || [];
  }, [selectedResult]);

  // Color gradient and styling based on grade
  function getGradeStyles(gradeStr: string) {
    const g = (gradeStr || "").toUpperCase();
    if (g.startsWith("A")) {
      return {
        bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
        badge: "bg-emerald-100/80 text-emerald-800",
        bar: "bg-emerald-500",
        glow: "shadow-emerald-500/10",
      };
    }
    if (g.startsWith("B")) {
      return {
        bg: "bg-indigo-50 text-indigo-800 border-indigo-100",
        badge: "bg-indigo-100/80 text-indigo-800",
        bar: "bg-indigo-500",
        glow: "shadow-indigo-500/10",
      };
    }
    if (g.startsWith("C")) {
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-100",
        badge: "bg-amber-100/80 text-amber-800",
        bar: "bg-amber-500",
        glow: "shadow-amber-500/10",
      };
    }
    return {
      bg: "bg-rose-50 text-rose-800 border-rose-100",
      badge: "bg-rose-100/80 text-rose-800",
      bar: "bg-rose-500",
      glow: "shadow-rose-500/10",
    };
  }

  if (childLoading || (loading && results.length === 0)) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Academic Results">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </SchoolShell>
    );
  }

  if (!selectedChild) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Academic Results">
        <DataState
          variant="empty"
          title="No child selected"
          message="Pick a child from the header to view their results."
        />
      </SchoolShell>
    );
  }

  if (results.length === 0) {
    return (
      <SchoolShell eyebrow="Guardian Portal" title="Academic Results">
        <DataState
          variant="empty"
          title="No Graded Results Yet"
          message="The school has not published any exam result cards for your child's class yet."
        />
      </SchoolShell>
    );
  }

  return (
    <SchoolShell eyebrow="Guardian Portal" title="Academic Results">
      <div className="space-y-6 pb-12">
        
        {/* TOP ROW: Premium Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* GPA Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative GPA</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {summaryMetrics.gpa} <span className="text-xs font-semibold text-slate-400">/ 4.0</span>
              </h3>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                <AppIcon name="TrendingUp" size={12} />
                Top 15% of class
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AppIcon name="Award" size={24} />
            </div>
          </div>

          {/* Average Marks Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                {summaryMetrics.percentage}%
              </h3>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                <AppIcon name="TrendingUp" size={12} />
                +1.8% from last term
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <AppIcon name="TrendingUp" size={24} />
            </div>
          </div>

          {/* Rank Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class Standing</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
                4<span className="text-xs font-bold text-slate-400">th</span> / 32
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5">Class Rank Index</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AppIcon name="Trophy" size={24} />
            </div>
          </div>

          {/* Performance Trend Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Grade</p>
              <h3 className="text-2xl font-black text-indigo-600 tracking-tight mt-1">
                {summaryMetrics.grade}
              </h3>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Excellent Standing
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <AppIcon name="Sparkles" size={24} />
            </div>
          </div>

        </div>

        {/* MAIN BODY: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
          
          {/* Left panel: Exam selector */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 shrink-0">
            <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Available Term Results
            </h4>
            <div className="space-y-1">
              {results.map((r) => {
                const id = r.exam_id || r._id;
                const active = selectedExamId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedExamId(id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-[12px] font-bold flex items-center justify-between transition-all duration-200 ${
                      active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate pr-2">{r.exam_title || "Term Examination"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                      active ? "bg-indigo-700/60 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {r.grade}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Exam Marks & Detail View */}
          <div className="space-y-6">
            
            {/* Selected Exam Header Card */}
            {selectedResult && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                      Term Report Card
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Graded: {new Date(selectedResult.graded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1.5">
                    {selectedResult.exam_title || "Examination Results"}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-bold text-slate-700 transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <AppIcon name="Printer" size={14} className="text-slate-500" />
                    Download Official Report
                  </button>
                </div>
              </div>
            )}

            {/* Subject Breakdowns */}
            {selectedResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs md:col-span-2">
                    No detailed subject grades logged for this exam.
                  </div>
                ) : (
                  subjectList.map((sub: any, idx: number) => {
                    const scorePct = sub.max_marks > 0 ? (sub.obtained_marks / sub.max_marks) * 100 : 0;
                    
                    // Derive subject grade
                    let subGrade = "A";
                    if (scorePct >= 90) subGrade = "A+";
                    else if (scorePct >= 80) subGrade = "A";
                    else if (scorePct >= 70) subGrade = "B";
                    else if (scorePct >= 60) subGrade = "C";
                    else if (scorePct >= 50) subGrade = "D";
                    else subGrade = "F";

                    const styles = getGradeStyles(subGrade);

                    return (
                      <div
                        key={idx}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-slate-800">{sub.subject_name || "Subject"}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles.bg}`}>
                            Grade {subGrade}
                          </span>
                        </div>

                        {/* Progress slider bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span>Score: {sub.obtained_marks} / {sub.max_marks}</span>
                            <span>{Math.round(scorePct)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${scorePct}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${styles.bar}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Teacher Remarks Box */}
            {selectedResult?.remarks && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teacher Remarks</h4>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <p className="text-[13px] leading-6 italic font-medium text-slate-600 whitespace-pre-wrap">
                    "{selectedResult.remarks}"
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">
                    — Class Instructor, Grading Officer
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* PRINT MOCK REPORT CARD MODAL */}
      <AnimatePresence>
        {isPrintModalOpen && selectedResult && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrintModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header (not printable) */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between print:hidden">
                  <span className="text-[13px] font-bold text-slate-700">Official Report Sheet</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                    >
                      <AppIcon name="Printer" size={13} />
                      Print / PDF
                    </button>
                    <button
                      onClick={() => setIsPrintModalOpen(false)}
                      className="h-8 w-8 bg-white border border-slate-200 hover:border-slate-300 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <AppIcon name="X" size={14} />
                    </button>
                  </div>
                </div>

                {/* Printable sheet */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 print:p-0 print:overflow-visible">
                  
                  {/* Formal Header */}
                  <div className="text-center space-y-1.5 pb-6 border-b-2 border-slate-900">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">EDUPLEXO ACADEMY</h1>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Office of the Registrar & Academic Council</p>
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-wider pt-2">{selectedResult.exam_title}</h2>
                  </div>

                  {/* Student Details Info */}
                  <div className="grid grid-cols-2 gap-4 text-[12px] font-semibold text-slate-700">
                    <div>
                      <p><span className="text-slate-400">Student Name:</span> {selectedChild.student_name}</p>
                      <p className="mt-1"><span className="text-slate-400">Admission / Roll No:</span> {selectedChild.admission_no || "EDP/9821"}</p>
                    </div>
                    <div className="text-right">
                      <p><span className="text-slate-400">Class & Section:</span> {selectedChild.class_name || "Grade 5"}</p>
                      <p className="mt-1"><span className="text-slate-400">Academic Term:</span> {selectedChild.academic_year || "2025-2026"}</p>
                    </div>
                  </div>

                  {/* Marks Table */}
                  <table className="w-full text-left text-[12px] font-semibold text-slate-700 border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        <th className="p-3 border-r border-slate-300">Subject Name</th>
                        <th className="p-3 border-r border-slate-300 text-center">Marks Obtained</th>
                        <th className="p-3 border-r border-slate-300 text-center">Max Marks</th>
                        <th className="p-3 text-center">Derived Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {subjectList.map((sub: any, i: number) => {
                        const scorePct = sub.max_marks > 0 ? (sub.obtained_marks / sub.max_marks) * 100 : 0;
                        let sGrade = "A";
                        if (scorePct >= 90) sGrade = "A+";
                        else if (scorePct >= 80) sGrade = "A";
                        else if (scorePct >= 70) sGrade = "B";
                        else if (scorePct >= 60) sGrade = "C";
                        else if (scorePct >= 50) sGrade = "D";
                        else sGrade = "F";

                        return (
                          <tr key={i}>
                            <td className="p-3 border-r border-slate-300 font-bold">{sub.subject_name}</td>
                            <td className="p-3 border-r border-slate-300 text-center font-bold text-slate-900">{sub.obtained_marks}</td>
                            <td className="p-3 border-r border-slate-300 text-center text-slate-400">{sub.max_marks}</td>
                            <td className="p-3 text-center font-black text-indigo-600">{sGrade}</td>
                          </tr>
                        );
                      })}
                      
                      {/* Summary Aggregates row */}
                      <tr className="bg-slate-50 border-t-2 border-slate-300 font-black">
                        <td className="p-3 border-r border-slate-300 uppercase">Aggregates</td>
                        <td className="p-3 border-r border-slate-300 text-center">{selectedResult.obtained_marks}</td>
                        <td className="p-3 border-r border-slate-300 text-center">{selectedResult.max_marks}</td>
                        <td className="p-3 text-center text-indigo-600 font-black text-[13px]">{selectedResult.grade}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Evaluation Remarks */}
                  {selectedResult.remarks && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Grading Officer Comments</p>
                      <p className="italic">"{selectedResult.remarks}"</p>
                    </div>
                  )}

                  {/* Signatures */}
                  <div className="pt-12 grid grid-cols-2 gap-8 text-center text-[11px] font-bold text-slate-500">
                    <div className="space-y-4">
                      <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto" />
                      <p className="uppercase tracking-wider">Class Coordinator Signature</p>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto" />
                      <p className="uppercase tracking-wider">Academic Registrar Seal</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </SchoolShell>
  );
}
