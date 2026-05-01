"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../../components/ui";
import { AnnouncementForm } from "../components/AnnouncementForm";
import { useAnnouncements } from "../hooks/useAnnouncements";

export function AnnouncementCreatePage() {
  const router = useRouter();
  const { addAnnouncement } = useAnnouncements();

  async function handleCreate(input: any) {
    const result = await addAnnouncement(input);
    if (result.ok) {
      router.push("/admin/announcements");
    }
    return result;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Create Announcement</h2>
        <AnnouncementForm onCreate={handleCreate} />
      </Card>
    </div>
  );
}
