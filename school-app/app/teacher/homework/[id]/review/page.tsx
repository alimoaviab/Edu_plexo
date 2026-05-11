"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import { HomeworkReviewPage } from "../../../../../modules/homework/pages/HomeworkReviewPage";

export default function TeacherHomeworkReviewPage() {
  const params = useParams();
  const homeworkId = params?.id as string;

  return (
    <SchoolShell eyebrow="Teacher Dashboard" title="Homework Submissions Review">
      <HomeworkReviewPage homeworkId={homeworkId} role="TEACHER" />
    </SchoolShell>
  );
}
