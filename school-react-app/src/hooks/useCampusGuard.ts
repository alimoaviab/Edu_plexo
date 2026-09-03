import { useEffect, useState, useCallback } from "react";
import { serviceRequest } from "@/services/service-client";
import { useAuth } from "@/hooks/useAuth";

export interface Campus {
  _id?: string;
  id?: string;
  name: string;
  code?: string;
  school_id: string;
}

export function useCampusGuard() {
  const { user, loading: authLoading } = useAuth();
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
      const isOwner = user?.role === "owner";
      const boundSchoolId = user?.schoolId || window.localStorage.getItem("active_school_id") || "";

      if (isOwner) {
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
        const url = schId ? `/api/campuses?school_id=${encodeURIComponent(schId)}` : "/api/campuses";
        const res = await serviceRequest<Campus[]>(url);
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          setCampuses(res.data);
          if (!window.localStorage.getItem("active_branch_id")) {
            const firstBranch = res.data[0]._id || res.data[0].id || "";
            setActiveCampusId(firstBranch);
            window.localStorage.setItem("active_branch_id", firstBranch);
          }
        } else if (schId && schoolList.length > 0) {
          const matchedSchool = schoolList.find(s => s.school_id === schId || s._id === schId) || schoolList[0];
          const fallbackCampus: Campus = {
            id: `cmp_${schId}`,
            _id: `cmp_${schId}`,
            name: matchedSchool.name || "Main Campus",
            school_id: schId,
            code: matchedSchool.code || "MAIN",
          };
          setCampuses([fallbackCampus]);
          setActiveCampusId(fallbackCampus.id!);
          window.localStorage.setItem("active_branch_id", fallbackCampus.id!);
        } else {
          setCampuses([]);
        }
      } else {
        // Non-owner role (admin, teacher, staff) — bound to their assigned school
        const schId = boundSchoolId;
        if (schId) {
          setActiveSchoolId(schId);
          window.localStorage.setItem("active_school_id", schId);
          setSchools([{ school_id: schId, name: "Current Campus / School" }]);
        }

        // Load campuses for this school
        const url = schId ? `/api/campuses?school_id=${encodeURIComponent(schId)}` : "/api/campuses";
        const res = await serviceRequest<Campus[]>(url);
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          setCampuses(res.data);
          const currentBranch = window.localStorage.getItem("active_branch_id");
          if (!currentBranch || !res.data.some(c => (c._id || c.id) === currentBranch)) {
            const firstBranch = res.data[0]._id || res.data[0].id || "";
            setActiveCampusId(firstBranch);
            window.localStorage.setItem("active_branch_id", firstBranch);
          }
        } else if (schId) {
          const fallbackCampus: Campus = {
            id: `cmp_${schId}`,
            _id: `cmp_${schId}`,
            name: "Main Campus",
            school_id: schId,
            code: "MAIN",
          };
          setCampuses([fallbackCampus]);
          setActiveCampusId(fallbackCampus.id!);
          window.localStorage.setItem("active_branch_id", fallbackCampus.id!);
        } else {
          setCampuses([]);
        }
      }
    } catch {
      setSchools([]);
      setCampuses([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.role, user?.schoolId]);

  useEffect(() => {
    if (!authLoading) {
      void loadData();
    }
  }, [authLoading, loadData]);

  const selectBranch = (branchId: string) => {
    window.localStorage.setItem("active_branch_id", branchId);
    setActiveCampusId(branchId);
  };

  const isOwner = user?.role === "owner";
  const hasSchools = isOwner
    ? (schools.length > 0 || Boolean(activeSchoolId))
    : Boolean(user?.schoolId || activeSchoolId || schools.length > 0);

  return {
    isLoading: authLoading || isLoading,
    schools,
    hasSchools,
    campuses,
    hasCampuses: campuses.length > 0,
    activeSchoolId,
    activeCampusId,
    selectBranch,
    reloadCampuses: loadData,
  };
}
