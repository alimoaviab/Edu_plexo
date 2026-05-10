"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  GraduationCap,
  Users,
  BookOpen,
  Calculator,
  TrendingUp,
  Calendar,
  DollarSign,
  Bell,
  FileText,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const roles = [
  {
    id: "admin",
    name: "Admin",
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
    description: "Complete school oversight and control",
    features: [
      "Real-time enrollment & revenue analytics",
      "Multi-campus management dashboard",
      "Staff performance & attendance tracking",
      "Financial reports & budget planning",
      "System-wide announcements & alerts",
      "Role-based access control",
    ],
  },
  {
    id: "teacher",
    name: "Teacher",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
    description: "Classroom management made effortless",
    features: [
      "One-tap attendance marking",
      "Digital gradebook & report cards",
      "Assignment creation & submission",
      "Parent communication portal",
      "Lesson planning & curriculum tracking",
      "Student behavior & progress notes",
    ],
  },
  {
    id: "parent",
    name: "Parent",
    icon: Users,
    color: "from-purple-500 to-pink-600",
    description: "Stay connected with your child's education",
    features: [
      "Real-time attendance notifications",
      "Live exam results & report cards",
      "Fee payment & receipt history",
      "Teacher messaging & meeting booking",
      "Homework & assignment tracking",
      "School announcements & events",
    ],
  },
  {
    id: "student",
    name: "Student",
    icon: BookOpen,
    color: "from-amber-500 to-orange-600",
    description: "Your personalized learning hub",
    features: [
      "Class timetable & schedule",
      "Assignment submissions & deadlines",
      "Exam results & performance analytics",
      "Digital library & study materials",
      "Attendance & leave requests",
      "Peer collaboration & discussions",
    ],
  },
  {
    id: "accountant",
    name: "Accountant",
    icon: Calculator,
    color: "from-cyan-500 to-blue-600",
    description: "Financial operations simplified",
    features: [
      "Fee collection & payment tracking",
      "Automated invoice generation",
      "Expense management & approvals",
      "Salary processing & payroll",
      "Financial reports & reconciliation",
      "Tax compliance & documentation",
    ],
  },
];

export const RoleBasedShowcase = () => {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            Tailored for Every User
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Powerful dashboards for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              every role
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed">
            From administrators to students, everyone gets a personalized experience designed for their specific needs and workflows.
          </p>
        </motion.div>

        {/* Role selector tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              onClick={() => setActiveRole(role)}
              className={`relative px-6 py-3 rounded-full font-semibold transition-all ${
                activeRole.id === role.id
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeRole.id === role.id && (
                <motion.div
                  layoutId="activeRoleTab"
                  className={`absolute inset-0 bg-gradient-to-r ${role.color} rounded-full shadow-lg`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <role.icon className="w-5 h-5" />
                {role.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Role content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Features list */}
            <div className="space-y-6">
              <div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole.color} mb-6 shadow-lg`}>
                  <activeRole.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {activeRole.name} Dashboard
                </h3>
                <p className="text-lg text-slate-300">
                  {activeRole.description}
                </p>
              </div>

              <div className="space-y-4">
                {activeRole.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${activeRole.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 px-8 py-4 bg-gradient-to-r ${activeRole.color} text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all`}
              >
                Explore {activeRole.name} Features
              </motion.button>
            </div>

            {/* Right: Dashboard preview */}
            <div className="relative">
              <DashboardPreview role={activeRole} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// Dashboard preview component
const DashboardPreview = ({ role }: { role: typeof roles[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Main dashboard card */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-slate-800/80 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
              <role.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{role.name} Portal</div>
              <div className="text-xs text-slate-400">Dashboard Overview</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, value: "2,847", label: "Total" },
              { icon: Calendar, value: "94.2%", label: "Active" },
              { icon: DollarSign, value: "₹8.4L", label: "Revenue" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-white/5"
              >
                <stat.icon className="w-5 h-5 text-slate-400 mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity list */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-lg border border-white/5"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Activity Item {i}</div>
                  <div className="text-xs text-slate-400">2 hours ago</div>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -top-4 -right-4 bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-xl w-64"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center`}>
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">New Update</div>
            <div className="text-xs text-slate-400">Just now</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
