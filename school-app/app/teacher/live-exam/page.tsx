"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";

export default function TeacherLiveExamPage() {
  return (
    <SchoolShell title="Live Exams" eyebrow="Teacher">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Live Exam Overview Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">My Live Exams</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Scheduled Today</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Active Participants</h3>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* Live Exam Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Live Exam Management</h2>
          <p className="text-gray-600">Schedule and monitor live online examinations for your students.</p>
          {/* Add live exam scheduling and monitoring components here */}
        </div>
      </div>
    </SchoolShell>
  );
}