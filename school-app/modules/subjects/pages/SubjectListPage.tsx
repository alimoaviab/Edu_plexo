"use client";

import { useState } from "react";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectEditSidebar } from "../components/SubjectEditSidebar";
import { SubjectRow, SubjectFormInput } from "../types";
import { showToast } from "@/utils/toast";

export function SubjectListPage() {
  const { data, isLoading, error, createSubject, updateSubject, deleteSubject } = useSubjects();

  const [editingSubject, setEditingSubject] = useState<SubjectRow | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(id: string | null, formData: SubjectFormInput) {
    try {
      setIsSaving(true);
      if (id) {
        await updateSubject(id, formData);
        showToast("Subject updated successfully");
      } else {
        await createSubject(formData);
        showToast("Subject created successfully");
      }
      setEditingSubject(null);
      setIsAdding(false);
    } catch (err: any) {
      showToast(err.message || "Failed to save subject");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      showToast("Subject deleted successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to delete subject");
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 min-h-[400px] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
        <p className="font-medium text-red-800">Error Loading Subjects</p>
        <p className="text-sm mt-1">{error || "Something went wrong"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
             <span className="material-symbols-outlined text-[24px]">menu_book</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Curriculum Inventory</p>
            <p className="text-sm font-bold text-slate-500">Manage institutional subjects and mappings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search code or name..."
                className="h-9 w-48 rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 text-xs focus:border-blue-300 focus:bg-white outline-none transition-all"
              />
           </div>
           <button
             onClick={() => setIsAdding(true)}
             className="flex h-9 items-center px-4 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95"
           >
             <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
             Initialize Subject
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {(data || []).map((row) => (
          <div
            key={row._id}
            className="premium-card group flex flex-col p-0 overflow-hidden transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5"
          >
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 font-black text-sm uppercase border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  {row.code ? row.code.substring(0, 2) : row.name.substring(0, 2).toUpperCase()}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingSubject(row)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 bg-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                  </button>
                  <button
                    onClick={() => handleDelete(row._id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-100 bg-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{row.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{row.code || "NO-CODE"}</span>
                   <span className="h-1 w-1 rounded-full bg-slate-300" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.academic_year || "All Sessions"}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                 <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100/50">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="material-symbols-outlined text-slate-400 text-[18px]">account_circle</span>
                       <span className="text-[11px] font-bold text-slate-700 truncate">{row.teacher_name || "Faculty Pending"}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">HOD</span>
                 </div>

                 <div className="flex flex-wrap gap-1.5">
                    {(row.class_mapping || ["Grade 10", "Grade 11"]).map(cls => (
                      <span key={cls} className="px-2 py-0.5 rounded-md bg-blue-50/50 text-blue-600 text-[9px] font-black uppercase tracking-tighter border border-blue-100/50">
                        {cls}
                      </span>
                    ))}
                 </div>
              </div>
            </div>

            <div className="mt-auto p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${row.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300"}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.status}</span>
              </div>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-slate-400">{i}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(data || []).length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-gray-400 text-3xl">menu_book</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Subjects Found</h3>
          <p className="text-gray-500 mb-6">Get started by creating the first subject.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Add Subject
          </button>
        </div>
      )}

      <SubjectEditSidebar
        isOpen={isAdding || editingSubject !== null}
        subject={editingSubject}
        onClose={() => {
          setIsAdding(false);
          setEditingSubject(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
