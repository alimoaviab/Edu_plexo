"use client";

import { colors, spacing, typography } from "@edu/shared/design-system/tokens";
import { AcademyYear } from "../types/academyCare.types";

export function AcademyCareTable({ years }: { years: AcademyYear[] }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: typography.bodyMd.fontFamily }}>
                <thead>
                    <tr style={{ background: colors.surfaceContainerHigh, borderBottom: `1px solid ${colors.cardBorder}` }}>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            Academic Year
                        </th>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            Start Date
                        </th>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            End Date
                        </th>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            Status
                        </th>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            Active
                        </th>
                        <th style={{ padding: spacing.md, textAlign: "left", ...typography.tableHeader, color: colors.onSurface }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {years.map((year) => (
                        <tr key={year._id} style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                            <td style={{ padding: spacing.md, ...typography.bodyMd }}>{year.year}</td>
                            <td style={{ padding: spacing.md, ...typography.bodyMd }}>
                                {new Date(year.start_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </td>
                            <td style={{ padding: spacing.md, ...typography.bodyMd }}>
                                {new Date(year.end_date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </td>
                            <td style={{ padding: spacing.md }}>
                                <span
                                    style={{
                                        background:
                                            year.status === "active"
                                                ? colors.success
                                                : year.status === "completed"
                                                    ? colors.outlineVariant
                                                    : colors.outline,
                                        color: "white",
                                        padding: `${spacing.xs}px ${spacing.sm}px`,
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        textTransform: "capitalize"
                                    }}
                                >
                                    {year.status}
                                </span>
                            </td>
                            <td style={{ padding: spacing.md, textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "4px",
                                        background: year.is_active ? colors.success : colors.outlineVariant,
                                        margin: "0 auto"
                                    }}
                                />
                            </td>
                            <td style={{ padding: spacing.md }}>
                                <button
                                    style={{
                                        background: colors.actionBlue,
                                        color: "white",
                                        border: "none",
                                        padding: `${spacing.xs}px ${spacing.sm}px`,
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: 500
                                    }}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
