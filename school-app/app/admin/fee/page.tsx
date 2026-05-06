"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";

export default function FeePage() {
    return (
        <SchoolShell title="Fee Management" eyebrow="Admin">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Fee Overview Cards */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Total Fees</h3>
                        <p className="text-2xl font-bold text-blue-600">$0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Paid Fees</h3>
                        <p className="text-2xl font-bold text-green-600">$0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Pending Fees</h3>
                        <p className="text-2xl font-bold text-red-600">$0</p>
                    </div>
                </div>

                {/* Fee Management Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Fee Management</h2>
                    <p className="text-gray-600">Manage student fees, payments, and fee structures.</p>
                    {/* Add fee management components here */}
                </div>
            </div>
        </SchoolShell>
    );
}