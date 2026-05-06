"use client";

import { useRouter, usePathname } from "next/navigation";
import { Card } from "../../../components/ui";
import { AnnouncementForm } from "../components/AnnouncementForm";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { showToast } from "../../../utils/toast";

export function AnnouncementCreatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { addAnnouncement } = useAnnouncements();

  async function handleCreate(input: any) {
    const result = await addAnnouncement(input);
    if (result.success) {
      showToast("Announcement published successfully", "success");
      const basePath = pathname.includes("/teacher") ? "/teacher/announcements" : "/admin/announcements";
      router.push(basePath);
    } else {
      showToast(result.message || "Failed to publish announcement", "error");
    }
    return result;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="p-3">
        <h2 className="mb-4 text-base font-semibold tracking-tight text-slate-950">Create Announcement</h2>
        <AnnouncementForm onCreate={handleCreate} />
      </Card>
    </div>
  );
}
