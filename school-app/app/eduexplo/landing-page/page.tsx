import React from 'react';
import { Shield, Users, GraduationCap, CheckCircle, CreditCard, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'SchoolCentral - The Complete School Management System',
  description: 'A comprehensive multi-role platform for admins, teachers, students, and parents.'
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Empower Your Educational Journey</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            SchoolCentral provides a comprehensive, multi-role platform that streamlines academics, attendance, fees, and exams, connecting admins, teachers, students, and parents in one unified system.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/admin/dashboard" className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Go to Admin Dashboard
            </Link>
            <Link href="/teacher/dashboard" className="bg-blue-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors">
              Teacher Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Everything You Need to Run Your School</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Multi-Role Access</h3>
              <p className="text-gray-600">
                Dedicated portals with custom permissions for Admins, Teachers, Students, and Parents. Secure and tailored experiences for every user.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Academic Management</h3>
              <p className="text-gray-600">
                Easily manage academic years, classes, subjects, and student enrollments. Keep your curriculum organized and accessible.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Attendance Tracking</h3>
              <p className="text-gray-600">
                Real-time attendance marking, instant viewing capabilities, and comprehensive reporting to monitor student presence effectively.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 text-yellow-600">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fee Management</h3>
              <p className="text-gray-600">
                Flexible fee configuration, automated monthly generation, and secure tracking of payments and dues.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-600">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Exam & Grading</h3>
              <p className="text-gray-600">
                Schedule exams, enter marks seamlessly, automate grading calculations, and publish results instantly to student portals.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Parent Portal</h3>
              <p className="text-gray-600">
                A consolidated dashboard for parents providing real-time alerts on homework, attendance records, and fee statuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Built for Everyone</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <Shield className="mx-auto mb-4 text-blue-400" size={32} />
                <h4 className="font-semibold text-lg mb-2">Administrators</h4>
                <p className="text-gray-400 text-sm">Full control over settings, users, and financials.</p>
              </div>
              <div>
                <Users className="mx-auto mb-4 text-green-400" size={32} />
                <h4 className="font-semibold text-lg mb-2">Teachers</h4>
                <p className="text-gray-400 text-sm">Tools for grading, attendance, and assignments.</p>
              </div>
              <div>
                <GraduationCap className="mx-auto mb-4 text-purple-400" size={32} />
                <h4 className="font-semibold text-lg mb-2">Students</h4>
                <p className="text-gray-400 text-sm">Access to homework, results, and learning materials.</p>
              </div>
              <div>
                <BookOpen className="mx-auto mb-4 text-yellow-400" size={32} />
                <h4 className="font-semibold text-lg mb-2">Parents</h4>
                <p className="text-gray-400 text-sm">Real-time insights into their child's progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to transform your school?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of educators and administrators who trust SchoolCentral to streamline their daily operations.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/parent/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
              Explore Parent Portal
            </Link>
            <Link href="/student/dashboard" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors">
              Student Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
