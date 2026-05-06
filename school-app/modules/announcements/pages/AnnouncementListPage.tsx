"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataTable, DataTableColumn, RowAction, Badge, DataState, Skeleton, TableSkeleton } from "../../../components/ui";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { AnnouncementRecordRow } from "../types/announcement.types";
import { showToast } from "../../../utils/toast";

export function AnnouncementListPage() {
  const pathname = usePathname();
  const { state, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const isValidObjectId = (value?: string) => typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

  const columns: DataTableColumn<AnnouncementRecordRow>[] = [
    {
      key: "priority",
      label: "Priority",
      render: (row) => (
        <Badge
          variant={
            row.priority === "urgent" ? "error" :
              row.priority === "high" ? "warning" :
                row.priority === "normal" ? "secondary" : "gray"
          }
          className="capitalize"
        >
          {row.priority}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{row.title}</span>
          <span className="text-xs text-gray-500 max-w-[300px] truncate">{row.content}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "target",
      label: "Target",
      render: (row) => (
        <Badge variant="gray" className="capitalize">{row.target_type}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge
          variant={
            row.status === "published" ? "success" :
              row.status === "draft" ? "warning" : "gray"
          }
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      render: (row) => (
        <span className="text-sm text-gray-500">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
        </span>
      ),
      sortable: true,
      sortFn: (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime(),
    },
  ];

  const rowActions: RowAction<AnnouncementRecordRow>[] = [
    {
      icon: "visibility",
      label: "View Details",
      variant: "primary",
      onClick: (row) => {
        alert(`Title: ${row.title}\nPriority: ${row.priority}\nTarget: ${row.target_type}\nStatus: ${row.status}`);
      },
    },
    {
      icon: "edit",
      label: "Edit",
      variant: "ghost",
      onClick: async (row) => {
        if (!isValidObjectId(row._id)) {
          showToast("Cannot edit this announcement due to invalid identifier", "error");
          return;
        }
        const status = window.prompt("Status (draft/published/archived)", row.status)?.trim();
        if (!status) return;
        const result = await updateAnnouncement(row._id, { status: status as any });
        if (!result.ok) {
          showToast(result.error.message || "Failed to update", "error");
        }
      },
    },
    {
      icon: "delete",
      label: "Delete",
      variant: "danger",
      requireConfirm: true,
      confirmTitle: "Delete Announcement",
      confirmMessage: (row: AnnouncementRecordRow) =>
        `Are you sure you want to delete "${row.title}"?`,
      onClick: async (row) => {
        if (!isValidObjectId(row._id)) {
          showToast("Cannot delete this announcement due to invalid identifier", "error");
          return;
        }
        const result = await deleteAnnouncement(row._id);
        if (!result.ok) {
          showToast(result.error.message || "Failed to delete", "error");
        }
      },
    },
  ];

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  if (state.status === "error") {
    return <DataState variant="error" title="Failed to load announcements" message={state.error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Notice Board</h2>
          <p className="text-sm font-medium text-slate-500">Institutional broadcast control and audience outreach</p>
        </div>
        {!pathname.includes("/parent") && (
          <Link
            href={pathname.includes("/teacher") ? "/teacher/announcements/create" : "/admin/announcements/create"}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">campaign</span>
            New Notice
          </Link>
        )}
      </div>

      {(state.data || []).length === 0 ? (
        <DataState variant="empty" title="No notices found" message="Keep the community informed by creating your first broadcast." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(state.data || []).map((row, index) => (
            <div
              key={isValidObjectId(row._id) ? row._id : `${row.title}-${index}`}
              className="premium-card group transition-all hover:border-blue-300 flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                   <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                      row.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                      row.priority === 'high' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-500 border-slate-100'
                   }`}>
                      {row.priority}
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!pathname.includes("/parent") && (
                        <>
                          <button 
                            onClick={async () => {
                              const status = window.prompt("Status (draft/published/archived)", row.status)?.trim();
                              if (status) await updateAnnouncement(row._id, { status: status as any });
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit_note</span>
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Delete notice?`)) await deleteAnnouncement(row._id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </>
                      )}
                   </div>
                </div>

                <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{row.title}</h3>
                <p className="text-[12px] text-slate-600 line-clamp-3 mb-4 leading-relaxed font-medium">
                  {row.content}
                </p>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                   <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="material-symbols-outlined text-[14px]">
                        {row.target_type === 'all' ? 'public' : row.target_type === 'teachers' ? 'badge' : 'person'}
                      </span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.target_type}</span>
                   <div className="ml-auto flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-slate-300">calendar_today</span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                      </span>
                   </div>
                </div>
              </div>
              
              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                 <span className={`text-[9px] font-black uppercase tracking-widest ${
                    row.status === 'published' ? 'text-emerald-600' : 'text-amber-600'
                 }`}>
                    {row.status}
                 </span>
                 <button className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1">
                    Read More
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
