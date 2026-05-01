import { SchoolShell } from "../../../layouts/SchoolShell";
import { AnnouncementPage } from "../../../modules/announcements/pages/AnnouncementPage";

export default function AdminAnnouncementsPage() {
    return (
        <SchoolShell eyebrow="Operations" title="Announcements">
            <AnnouncementPage />
        </SchoolShell>
    );
}
