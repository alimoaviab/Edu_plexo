"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Skeleton, DataState } from "../../../components/ui";
import { LiveClassForm } from "../components/LiveClassForm";
import { showToast } from "../../../utils/toast";

interface LiveClassCreatePageProps {
  role: "ADMIN" | "TEACHER";
}

export function LiveClassCreatePage({ role }: LiveClassCreatePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    classes: [],
    subjects: [],
    teachers: []
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const isTeacher = role === "TEACHER";
      
      const endpoints = [
        fetch(isTeacher ? "/api/school/my-classes" : "/api/classes"),
        fetch("/api/subjects")
      ];

      if (role === "ADMIN") {
        endpoints.push(fetch("/api/teachers"));
      }

      const responses = await Promise.all(endpoints);
      const data = await Promise.all(responses.map(r => r.json()));

      const classesData = data[0];
      const subjectsData = data[1];
      const teachersData = data[2];

      setFormData({
        // Admin /api/classes returns data: [...]
        // Teacher /api/school/my-classes returns data: { classes: [...] }
        classes: isTeacher 
          ? (classesData.data?.classes || classesData.classes || [])
          : (classesData.data || []),
        subjects: subjectsData.data || [],
        teachers: teachersData?.data || []
      });
    } catch (error) {
      console.error("Failed to load form data", error);
      showToast("Failed to load required data", "error");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/live/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showToast("Live class scheduled successfully", "success");
        router.push(role === "ADMIN" ? "/admin/live-class" : "/teacher/live-class");
        router.refresh();
      } else {
        showToast(result.error || "Failed to schedule class", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred during scheduling", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && formData.classes.length === 0 && role === "TEACHER") {
     return (
       <DataState 
         variant="error" 
         title="No Classes Assigned" 
         message="You must have assigned classes to schedule a live session. Please contact the administrator."
       />
     );
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      <Link
        href={role === "ADMIN" ? "/admin/live-class" : "/teacher/live-class"}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Live Classes
      </Link>

      <Card className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Schedule New Live Session</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Setup a live video session for your students. Meeting links will be automatically shared.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
        ) : (
          <LiveClassForm
            onSubmit={handleSubmit}
            classes={formData.classes}
            subjects={formData.subjects}
            teachers={formData.teachers}
            showTeacherField={role === "ADMIN"}
            loading={submitting}
          />
        )}
      </Card>
    </div>
  );
}
