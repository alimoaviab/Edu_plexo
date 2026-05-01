import { useState, useCallback, useEffect } from "react";
import { SubjectRow, SubjectFormInput } from "../types";
import { serviceRequest } from "@/services/service-client";

export function useSubjects() {
  const [data, setData] = useState<SubjectRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await serviceRequest<SubjectRow[]>("/api/subjects");
      if (!res.ok) throw new Error(res.error.message || "Failed to fetch subjects");
      setData(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubject = async (input: SubjectFormInput) => {
    const res = await serviceRequest<SubjectRow>("/api/subjects", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(res.error.message || "Failed to create subject");
    await fetchSubjects();
  };

  const updateSubject = async (id: string, input: Partial<SubjectFormInput>) => {
    const res = await serviceRequest<SubjectRow>(`/api/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(res.error.message || "Failed to update subject");
    await fetchSubjects();
  };

  const deleteSubject = async (id: string) => {
    const res = await serviceRequest<null>(`/api/subjects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(res.error.message || "Failed to delete subject");
    await fetchSubjects();
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    data,
    isLoading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    refresh: fetchSubjects,
  };
}
