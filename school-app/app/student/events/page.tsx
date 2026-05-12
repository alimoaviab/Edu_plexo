"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";
import EventListPage from "../../../modules/events/components/EventListPage";

export default function StudentEventsPage() {
    return (
        <SchoolShell eyebrow="Parent Portal" title="Events">
            <EventListPage />
        </SchoolShell>
    );
}