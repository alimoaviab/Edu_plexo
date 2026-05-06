"use client";

import { Badge, Button, DataTable } from "../../../components/ui";
import { AcademicYearRow } from "../types/academicYear.types";

export function AcademicYearTable({ years }: { years: AcademicYearRow[] }) {
    const formatDate = (value: string) => new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const columns = [
        {
            key: "year",
            label: "Academic Year",
            render: (row: AcademicYearRow) => (
                <div className="font-semibold text-slate-950">{row.year}</div>
            )
        },
        {
            key: "start_date",
            label: "Start Date",
            render: (row: AcademicYearRow) => (
                <div className="text-slate-600">{formatDate(row.start_date)}</div>
            )
        },
        {
            key: "end_date",
            label: "End Date",
            render: (row: AcademicYearRow) => (
                <div className="text-slate-600">{formatDate(row.end_date)}</div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (row: AcademicYearRow) => {
                const variant = row.status === "active" ? "success" : row.status === "completed" ? "secondary" : row.status === "cancelled" ? "error" : "gray";
                return <Badge variant={variant} className="capitalize">{row.status}</Badge>;
            }
        },
        {
            key: "is_active",
            label: "Current",
            render: (row: AcademicYearRow) => (
                row.is_active ? (
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Active
                    </div>
                ) : <span className="text-slate-400">—</span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: () => (
                <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-50">
                    Edit
                </Button>
            )
        }
    ];

    return <DataTable columns={columns} rows={years} />;
}
