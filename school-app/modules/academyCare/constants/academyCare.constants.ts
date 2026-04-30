export const ACADEMY_CARE_STATUS = {
    DRAFT: "draft",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
} as const;

export const ACADEMY_CARE_TABLE_COLUMNS = [
    { header: "Academic Year", key: "year", width: "20%" },
    { header: "Start Date", key: "start_date", width: "20%" },
    { header: "End Date", key: "end_date", width: "20%" },
    { header: "Status", key: "status", width: "15%" },
    { header: "Active", key: "is_active", width: "15%" },
    { header: "Actions", key: "actions", width: "10%" }
];
