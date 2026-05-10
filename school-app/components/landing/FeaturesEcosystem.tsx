"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  BellRing,
  GraduationCap,
  Brain,
  Shield,
  Smartphone,
  Clock,
  FileText,
  Video,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Lifecycle Management",
    description: "Complete 360° student profiles with admission, academics, behavior, health records, and parent communication in one unified system.",
    color: "from-blue-500 to-indigo-600",
    stats: "2,847 Active Students",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Predictive analytics for attendance patterns, fee defaulters, student performance trends, and automated report generation.",
    color: "from-purple-500 to-pink-600",
    stats: "94% Accuracy",
  },
  {
    icon: CalendarCheck,
    title: "Smart Attendance System",
    description: "Lightning-fast attendance with QR codes, biometric integration, real-time parent notifications, and automated absence tracking.",
    color: "from-emerald-500 to-teal-600",
    stats: "< 30 sec per class",
  },
  {
    icon: CreditCard,
    title: "Automated Fee Management",
    description: "Online payments, automated invoicing, installment tracking, late fee calculation, and instant receipt generation.",
    color: "from-amber-500 to-orange-600",
    stats: "₹12.4Cr Processed",
  },
  {
    icon: LayoutDashboard,
    title: "Multi-Role Dashboards",
    description: "Customized interfaces for Admin, Teachers, Parents, Students, and Accountants with role-based permissions and workflows.",
    color: "from-cyan-500 to-blue-600",
    stats: "5 Role Types",
  },
  {
    icon: GraduationCap,
    title: "Exam & Result Intelligence",
    description: "Digital exam scheduling, online assessments, automated grading, beautiful report cards, and performance analytics.",
    color: "from-rose-500 to-red-600",
    stats: "15,000+ Exams",
  },
  {
    icon: Video,
    title: "Live Class Integration",
    description: "Built-in video conferencing, screen sharing, attendance tracking, recording, and assignment distribution for hybrid learning.",
    color: "from-indigo-500 to-violet-600",
    stats: "1,200+ Classes",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Executive dashboards with enrollment trends, revenue insights, teacher performance, and operational KPIs with export capabilities.",
    color: "from-blue-600 to-indigo-700",
    stats: "50+ Reports",
  },
  {
    icon: BellRing,
    title: "Omnichannel Communication",
    description: "Instant SMS, email, push notifications, and in-app messaging for announcements, alerts, and parent-teacher coordination.",
    color: "from-yellow-500 to-amber-600",
    stats: "99.8% Delivery",
  },
  {
    icon: BookOpen,
    title: "Curriculum & Timetable",
    description: "Drag-and-drop timetable builder, subject allocation, teacher scheduling, and automatic conflict detection.",
    color: "from-green-500 to-emerald-600",
    stats: "Zero Conflicts",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption, role-based access control, audit logs, data backup, and GDPR compliance for complete peace of mind.",
    color: "from-slate-600 to-slate-800",
    stats: "ISO 27001 Certified",
  },
  {
    icon: Smartphone,
    title: "Native Mobile Apps",
    description: "iOS and Android apps for parents and teachers with offline support, push notifications, and seamless sync.",
    color: "from-pink-500 to-rose-600",
    stats: "4.8★ Rating",
  },
];

export const FeaturesEcosystem = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            Complete School Operating System
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Everything you need to run a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              modern school
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            From admissions to alumni, from attendance to analytics—manage every aspect of your school with enterprise-grade tools designed for education.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity`}
                  />
                )}
              </AnimatePresence>

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Stats badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-6">
            And 50+ more features to streamline every aspect of school operations
          </p>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Explore All Features
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
