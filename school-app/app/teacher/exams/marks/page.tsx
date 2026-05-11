"use client";

import { useSearchParams } from "next/navigation";
import { SchoolShell } from "../../../../layouts/SchoolShell";
import { ExamMarksEntryPage } from "../../../../modules/exams/pages/ExamMarksEntryPage";

export default function TeacherExamMarksPage() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam_id") || "";

  return (
    <SchoolShell eyebrow="Teacher Dashboard" title="Marks Entry Workspace">
      <ExamMarksEntryPage examId={examId} />
    </SchoolShell>
  );
}
