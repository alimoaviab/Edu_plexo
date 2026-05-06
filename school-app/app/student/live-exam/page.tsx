"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";

export default function StudentLiveExamPage() {
  return (
    <SchoolShell title="Live Exams" eyebrow="Student">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Live Exam Overview Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upcoming Exams</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Today's Exams</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Completed Exams</h3>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* Live Exam Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Live Exams</h2>
          <p className="text-gray-600">Participate in your scheduled live online examinations.</p>
          {/* Add live exam joining and taking components here */}
        </div>
      </div>
    </SchoolShell>
  );
}