import { useEffect, useState } from "react";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";

export function OwnerSchoolSwitcher() {
  const [schools, setSchools] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState<string>("");
  const [activeBranchId, setActiveBranchId] = useState<string>("");

  useEffect(() => {
    async function loadSchools() {
      try {
        const res = await serviceRequest<any[]>("/api/owner/schools");
        if (res.ok && Array.isArray(res.data)) {
          const list = res.data;
          if (list.length > 0) {
            setSchools(list);
            
            let curSchool = window.localStorage.getItem("active_school_id");
            if (!curSchool && list.length > 0) {
              const first = list.find((s: any) => s.status === "active") || list[0];
              curSchool = String(first.school_id || first._id || "");
              if (curSchool) {
                window.localStorage.setItem("active_school_id", curSchool);
              }
            }
            if (curSchool) {
              setActiveSchoolId(curSchool);
            }

            const curBranch = window.localStorage.getItem("active_branch_id") || "";
            setActiveBranchId(curBranch);
          }
        }
      } catch (err) {
        console.error("Failed to load schools for switcher", err);
      }
    }
    loadSchools();
  }, []);

  useEffect(() => {
    async function loadCampuses() {
      if (!activeSchoolId) {
        setCampuses([]);
        return;
      }
      try {
        const res = await serviceRequest<any[]>(`/api/owner/campuses?school_id=${activeSchoolId}`);
        if (res.ok && Array.isArray(res.data)) {
          const list = res.data;
          setCampuses(list);
          
          let curBranch = window.localStorage.getItem("active_branch_id") || "";
          if (!curBranch && list.length > 0) {
            const first = list[0];
            curBranch = String(first._id || first.id || "");
            if (curBranch) {
              window.localStorage.setItem("active_branch_id", curBranch);
              setActiveBranchId(curBranch);
            }
          }
        } else {
          setCampuses([]);
        }
      } catch (err) {
        console.error("Failed to load campuses", err);
        setCampuses([]);
      }
    }
    loadCampuses();
  }, [activeSchoolId]);

  const handleSchoolSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId === activeSchoolId) return;
    window.localStorage.setItem("active_school_id", newId);
    window.localStorage.setItem("active_branch_id", "");
    setActiveSchoolId(newId);
    setActiveBranchId("");
    window.location.reload();
  };

  const handleBranchSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBranch = e.target.value;
    if (newBranch === activeBranchId) return;
    window.localStorage.setItem("active_branch_id", newBranch);
    setActiveBranchId(newBranch);
    window.location.reload();
  };

  if (schools.length === 0) return null;

  return (
    <div className="hidden sm:flex items-center gap-2">
      {/* School Selector */}
      <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-sm">
        <AppIcon name="Building" size={14} className="text-blue-600" />
        <select
          value={activeSchoolId}
          onChange={handleSchoolSwitch}
          className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer max-w-[140px] truncate"
        >
          <option value="" disabled>Select School...</option>
          {schools.map((s) => (
            <option key={s._id || s.school_id} value={s.school_id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Branch Selector */}
      {campuses.length > 1 && (
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-sm">
          <AppIcon name="GitBranch" size={14} className="text-emerald-600" />
          <select
            value={activeBranchId}
            onChange={handleBranchSwitch}
            className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="">All Campuses</option>
            {campuses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
