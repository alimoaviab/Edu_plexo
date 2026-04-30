"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { Card, DataState } from "../../../components/ui";
import { StudentForm } from "../components/StudentForm";
import { StudentTable } from "../components/StudentTable";
import { useStudents } from "../hooks/useStudents";

export function StudentsPage() {
  const { state, addStudent } = useStudents();

  return (
    <div style={{ display: "grid", gap: spacing.lg }}>
      <Card>
        <StudentForm onCreate={addStudent} />
      </Card>

      {state.status === "loading" || state.status === "idle" ? (
        <DataState variant="loading" title="Loading students" />
      ) : null}

      {state.status === "error" ? (
        <DataState variant="error" title="Failed to load students" message={state.error} />
      ) : null}

      {state.status === "empty" ? (
        <DataState variant="empty" title="No students found" message="Create the first student record for this school." />
      ) : null}

      {state.status === "success" && state.data && state.data.length > 0 ? (
        <Card style={{ padding: 0, overflow: "hidden", borderColor: colors.cardBorder }}>
          <div style={{ padding: spacing.md, borderBottom: `1px solid ${colors.cardBorder}`, background: colors.surfaceContainerLowest }}>
            <h2 style={{ ...typography.h3, margin: 0, color: colors.onSurface }}>Students</h2>
          </div>
          <div style={{ padding: spacing.md }}>
            <StudentTable students={state.data} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
