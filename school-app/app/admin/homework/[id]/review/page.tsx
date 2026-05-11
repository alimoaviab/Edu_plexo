"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SchoolShell } from "../../../../../layouts/SchoolShell";
import { HomeworkReviewPage } from "../../../../../modules/homework/pages/HomeworkReviewPage";

export default function AdminHomeworkReviewPage() {
  const params = useParams();
  const homeworkId = params?.id as string;

  return (
    <SchoolShell eyebrow="Admin Dashboard" title="Homework Submissions Review">
      <HomeworkReviewPage homeworkId={homeworkId} role="ADMIN" />
    </SchoolShell>
  );
}
