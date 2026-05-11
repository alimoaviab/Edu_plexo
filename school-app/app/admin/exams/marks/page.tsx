"use client";

import { useSearchParams } from "next/navigation";
import { SchoolShell } from "../../../../layouts/SchoolShell";
import { ExamMarksEntryPage } from "../../../../modules/exams/pages/ExamMarksEntryPage";

export default function AdminExamMarksPage() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam_id") || "";

  return (
    <SchoolShell eyebrow="Admin Dashboard" title="Marks Entry Workspace">
      <ExamMarksEntryPage examId={examId} role="ADMIN" />
    </SchoolShell>
  );
}
