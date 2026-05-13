"use client";

import { useEffect, useState } from "react";
import { PlatformShell } from "../../../layouts/PlatformShell";
import { Card, DataState, Button } from "../../../components/ui";
import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { showToast } from "../../../utils/toast";

export default function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setSchoolId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!schoolId) return;

    async function loadDetail() {
      try {
        const response = await fetch(`/api/schools/${schoolId}`);
        if (!response.ok) throw new Error("Failed to load school details");
        const json = await response.json();
        if (json.ok) {
          setSchool(json.data);
        } else {
          throw new Error(
            json.error.message || "Failed to load school details",
          );
        }
      } catch (err: any) {
        setError(err.message);
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [schoolId]);

  if (loading) {
    return (
      <PlatformShell eyebrow="Super Admin" title="School Details">
        <DataState variant="loading" title="Loading Details" />
      </PlatformShell>
    );
  }

  if (error || !school) {
    return (
      <PlatformShell eyebrow="Super Admin" title="School Details">
        <DataState
          variant="error"
          title="Unavailable"
          message={error || "School not found"}
        />
      </PlatformShell>
    );
  }

  const metrics = [
    { label: "Total Students", value: school.stats?.students ?? 0 },
    { label: "Total Teachers", value: school.stats?.teachers ?? 0 },
    { label: "Total Classes", value: school.stats?.classes ?? 0 },
    { label: "Total Parents", value: school.stats?.parents ?? 0 },
    {
      label: "Active Academic Year",
      value: school.settings?.academic_year || "Not Set",
    },
    { label: "Storage Usage", value: `${school.usage?.storage_mb ?? 0} MB` },
    {
      label: "Attendance Avg",
      value: school.stats?.attendance_percent
        ? `${school.stats.attendance_percent}%`
        : "N/A",
    },
    {
      label: "Fee Collection",
      value: school.stats?.fee_collection
        ? `$${school.stats.fee_collection}`
        : "N/A",
    },
  ];

  return (
    <PlatformShell eyebrow="Super Admin" title={`Overview: ${school.name}`}>
      <div style={{ display: "grid", gap: spacing.md }}>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h2 style={{ ...typography.h2, margin: 0 }}>{school.name}</h2>
              <p
                style={{
                  ...typography.bodyMd,
                  color: colors.onSurfaceVariant,
                  marginTop: spacing.xs,
                }}
              >
                {school.school_id} • Plan:{" "}
                {school.subscription_plan || school.plan?.key || "N/A"} •
                Status:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {school.status}
                </strong>
              </p>
            </div>
            <Button variant="secondary" onClick={() => window.history.back()}>
              Back
            </Button>
          </div>
          <div
            style={{
              marginTop: spacing.md,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: spacing.md,
            }}
          >
            <div>
              <strong>Owner:</strong>{" "}
              {school.owner_name || school.admin_profile?.name || "N/A"}
              <br />
              <strong>Email:</strong>{" "}
              {school.contact_email || school.admin_profile?.email || "N/A"}
              <br />
              <strong>Phone:</strong>{" "}
              {school.contact_phone || school.admin_profile?.phone || "N/A"}
              <br />
            </div>
            <div>
              <strong>Address:</strong> {school.address || "N/A"}
              <br />
              <strong>Created:</strong>{" "}
              {school.created_at
                ? new Date(school.created_at).toLocaleDateString()
                : "N/A"}
              <br />
              <strong>Domains:</strong> {school.domains?.join(", ") || "N/A"}
              <br />
            </div>
          </div>
        </Card>

        <h3 style={{ ...typography.h3, marginTop: spacing.md }}>ERP Stats</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: spacing.md,
          }}
        >
          {metrics.map((m, i) => (
            <Card key={i}>
              <span
                style={{
                  ...typography.labelMd,
                  color: colors.onSurfaceVariant,
                }}
              >
                {m.label}
              </span>
              <strong
                style={{
                  ...typography.h3,
                  display: "block",
                  marginTop: spacing.xs,
                }}
              >
                {m.value}
              </strong>
            </Card>
          ))}
        </div>

        <h3 style={{ ...typography.h3, marginTop: spacing.md }}>
          Recent Activity
        </h3>
        <Card>
          {school.recent_activity && school.recent_activity.length > 0 ? (
            <ul
              style={{
                paddingLeft: "20px",
                margin: 0,
                ...typography.bodyMd,
              }}
            >
              {school.recent_activity.map((act: any, i: number) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  <strong>{new Date(act.time).toLocaleDateString()}</strong>:{" "}
                  {act.action}
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                ...typography.bodyMd,
                color: colors.onSurfaceVariant,
                margin: 0,
              }}
            >
              No recent activity available.
            </p>
          )}
        </Card>
      </div>
    </PlatformShell>
  );
}
