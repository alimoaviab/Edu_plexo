"use client";

import { SchoolShell } from "../../../layouts/SchoolShell";

export default function SalaryPage() {
    return (
        <SchoolShell title="Salary Management" eyebrow="Admin">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Salary Overview Cards */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Total Salaries</h3>
                        <p className="text-2xl font-bold text-blue-600">$0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Paid This Month</h3>
                        <p className="text-2xl font-bold text-green-600">$0</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
                        <p className="text-2xl font-bold text-red-600">0</p>
                    </div>
                </div>

                {/* Salary Management Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Salary Management</h2>
                    <p className="text-gray-600">Manage staff salaries, payroll, and compensation structures.</p>
                    {/* Add salary management components here */}
                </div>
            </div>
        </SchoolShell>
    );
}