import { useEffect, useState } from "react";
import { AppIcon } from "shared/ui/AppIcon";
import { serviceRequest } from "@/services/service-client";

export function OwnerSchoolSwitcher() {
  const [schools, setSchools] = useState<any[]>([]);
  const [activeSchoolId, setActiveSchoolId] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await serviceRequest<any[]>("/api/owner/schools");
        if (res.success && res.data) {
          setSchools(res.data);
          
          const stored = window.localStorage.getItem("active_school_id");
          if (stored) {
            setActiveSchoolId(stored);
          } else if (res.data.length > 0) {
            // Default to first active school
            const first = res.data.find(s => s.status === "active") || res.data[0];
            window.localStorage.setItem("active_school_id", first.school_id);
            setActiveSchoolId(first.school_id);
            window.location.reload();
          }
        }
      } catch (err) {
        console.error("Failed to load schools for switcher", err);
      }
    }
    load();
  }, []);

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId === activeSchoolId) return;
    window.localStorage.setItem("active_school_id", newId);
    setActiveSchoolId(newId);
    // Reload to ensure all context switches
    window.location.reload();
  };

  if (schools.length === 0) return null;

  return (
    <div className="hidden sm:flex items-center gap-2 rounded-md border border-slate-100 bg-white px-2 py-1">
      <AppIcon name="Building" size={14} className="text-slate-400" />
      <select
        value={activeSchoolId}
        onChange={handleSwitch}
        className="bg-transparent text-[10px] font-bold text-slate-700 outline-none cursor-pointer max-w-[150px] truncate"
      >
        <option value="" disabled>Select Campus...</option>
        {schools.map((s) => (
          <option key={s._id} value={s.school_id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
