import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "shared/ui/AppIcon";

export const RoleBasedExperienceSection = () => {
  const [activeRole, setActiveRole] = useState(0);

  const roles = [
    { id: "admin", label: "Admin", icon: "ShieldCheck" },
    { id: "teacher", label: "Teacher", icon: "BookOpen" },
    { id: "parent", label: "Parent", icon: "Users" },
  ];

  return (
    <section id="platform" className="py-24 bg-white dark:bg-slate-900/40 transition-colors duration-300" aria-labelledby="role-based-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            id="role-based-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            School ERP Built for <span className="text-blue-600 dark:text-sky-400">Everyone</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 font-medium"
          >
            EduPlexo delivers distinct, perfectly-tailored experiences for every role in your educational institution.
          </motion.p>
        </div>

        {/* Tabs Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center mb-8 scrollbar-hide" role="tablist">
          {roles.map((role, idx) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(idx)}
              role="tab"
              aria-selected={activeRole === idx}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-semibold ${
                activeRole === idx
                  ? "bg-slate-900 dark:bg-sky-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-sky-600/30"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <AppIcon name={role.icon} className="w-5 h-5" />
              {role.label}
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {activeRole === 0 && (
                <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                   <div className="flex-1 space-y-6">
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard — Total Operational Control</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">Oversee multiple campuses, manage staff permissions, and access high-level analytics in real time with the EduPlexo admin portal.</p>
                      <ul className="space-y-3">
                         {["Multi-branch school management", "Advanced permission roles", "System-wide analytics dashboard"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-sky-400" /> {item}
                            </li>
                         ))}
                      </ul>
                   </div>
                    <div className="flex-1 w-full h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                       <img
                         src="/role-admin-preview.png"
                         alt="EduPlexo Admin Dashboard — School Management System Admin Portal"
                         className="w-full h-full object-cover object-top border-none"
                         loading="lazy"
                         width="600"
                         height="320"
                       />
                    </div>
                </div>
              )}
              {activeRole === 1 && (
                <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                   <div className="flex-1 space-y-6">
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Teacher Portal — Empower Educators</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">Spend less time on paperwork and more time teaching with automated grading, attendance tools, and the teacher dashboard.</p>
                      <ul className="space-y-3">
                         {["One-click attendance marking", "Automated gradebook management", "Classroom behavior tracking"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-sky-400" /> {item}
                            </li>
                         ))}
                      </ul>
                   </div>
                    <div className="flex-1 w-full h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                       <img
                         src="/role-teacher-preview.png"
                         alt="EduPlexo Teacher Dashboard — School Management Teacher Portal"
                         className="w-full h-full object-cover object-top border-none"
                         loading="lazy"
                         width="600"
                         height="320"
                       />
                    </div>
                </div>
              )}
              {activeRole === 2 && (
                <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                   <div className="flex-1 space-y-6">
                     <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Parent Portal — Fee Payments & Progress Tracking</h3>
                     <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">A dedicated parent portal for secure online fee payments, real-time tracking of children's attendance and grades, and direct teacher communication.</p>
                      <ul className="space-y-3">
                       {["Secure online fee payment & digital receipts", "Real-time student attendance & grade tracking", "Direct parent-teacher messaging channels"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                          <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-sky-400" /> {item}
                           </li>
                          ))}
                      </ul>
                   </div>
                    <div className="flex-1 w-full h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                       <img
                         src="/role-parent-preview.png"
                         alt="EduPlexo Parent Portal — School Management Parent Dashboard"
                         className="w-full h-full object-cover object-top border-none"
                         loading="lazy"
                         width="600"
                         height="320"
                       />
                    </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
