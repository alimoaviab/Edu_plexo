"use client";

import { Badge } from "../../../components/ui";
import { AcademyYear } from "../types/academyCare.types";

export function AcademyCareTable({
    years,
    onView,
    onEdit,
    onDelete
}: {
    years: AcademyYear[];
    onView: (row: AcademyYear) => void;
    onEdit: (row: AcademyYear) => void;
    onDelete: (row: AcademyYear) => void;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {years.map((row) => (
                <article
                    key={row._id}
                    className="h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                    <div className="mb-3 flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-gray-900">{row.year}</h4>
                        <Badge variant={row.status === "active" ? "success" : "gray"} className="capitalize">
                            {row.status}
                        </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                        <p>
                            <span className="font-medium text-gray-700">Start:</span>{" "}
                            {new Date(row.start_date).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">End:</span>{" "}
                            {new Date(row.end_date).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Active:</span>{" "}
                            {row.is_active ? "Yes" : "No"}
                        </p>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm text-gray-500">{row.description || "No description"}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => onView(row)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            View
                        </button>
                        <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                            Delete
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}
