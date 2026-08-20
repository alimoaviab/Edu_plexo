import { useEffect, useState, useCallback } from "react";
import { serviceRequest } from "@/services/service-client";

export interface Campus {
  _id?: string;
  id?: string;
  name: string;
  code?: string;
  school_id: string;
}

export function useCampusGuard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSchoolId, setActiveSchoolId] = useState<string>(() => {
    return window.localStorage.getItem("active_school_id") || "";
  });
  const [activeCampusId, setActiveCampusId] = useState<string>(() => {
    return window.localStorage.getItem("active_branch_id") || "";
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Load Schools for owner
      const schoolRes = await serviceRequest<any[]>("/api/owner/schools");
      let schoolList: any[] = [];
      if (schoolRes.ok && Array.isArray(schoolRes.data)) {
        schoolList = schoolRes.data;
        setSchools(schoolList);
      } else {
        setSchools([]);
      }

      const schId = window.localStorage.getItem("active_school_id") || (schoolList[0]?.school_id || schoolList[0]?._id || "");
      if (schId) {
        setActiveSchoolId(schId);
        window.localStorage.setItem("active_school_id", schId);
      }

      // 2. Load Campuses for active school
      const url = schId ? `/api/owner/campuses?school_id=${encodeURIComponent(schId)}` : "/api/owner/campuses";
      const res = await serviceRequest<Campus[]>(url);
      if (res.ok && Array.isArray(res.data)) {
        setCampuses(res.data);
      } else {
        setCampuses([]);
      }
    } catch {
      setSchools([]);
      setCampuses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectBranch = (branchId: string) => {
    window.localStorage.setItem("active_branch_id", branchId);
    setActiveCampusId(branchId);
  };

  return {
    isLoading,
    schools,
    hasSchools: schools.length > 0 || Boolean(activeSchoolId),
    campuses,
    hasCampuses: campuses.length > 0,
    activeSchoolId,
    activeCampusId,
    selectBranch,
    reloadCampuses: loadData,
  };
}
