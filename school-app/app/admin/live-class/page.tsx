"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";

export default function LiveClassPage() {
    return (
        <SchoolShell title="Live Classes" eyebrow="Admin">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Live Class Overview Cards */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Active Classes</h3>
                        <p className="text-2xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Scheduled Today</h3>
                        <p className="text-2xl font-bold text-green-600">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Total Participants</h3>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                    </div>
                </div>

                {/* Live Class Management Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Live Class Management</h2>
                    <p className="text-gray-600">Schedule and manage live online classes for students.</p>
                    {/* Add live class scheduling and management components here */}
                </div>
            </div>
        </SchoolShell>
    );
}