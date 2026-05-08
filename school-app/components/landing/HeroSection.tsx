"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-[#F5F7FB]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>The Next Generation School Operating System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Manage your school with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              intelligent precision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A powerful, all-in-one platform built to automate administration, engage parents, and empower teachers. Designed with enterprise-grade security and Apple-level polish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <Play className="w-4 h-4" /> Watch Preview
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> Bank-grade Security</span>
            <span className="hidden sm:flex items-center gap-1.5"><Zap className="w-4 h-4 text-blue-500" /> Lightning Fast</span>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur opacity-20" />
          <div className="relative rounded-[2rem] bg-white border border-slate-200/50 shadow-2xl overflow-hidden">
            {/* Browser Header Fake */}
            <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
            {/* Dashboard Image / Layout mock */}
            <div className="aspect-[16/10] bg-slate-50 relative p-6">
              {/* Fake dashboard UI grid */}
              <div className="grid grid-cols-12 gap-6 h-full">
                {/* Sidebar */}
                <div className="col-span-3 h-full bg-white rounded-xl border border-slate-200 p-4 hidden md:block shadow-sm">
                  <div className="h-6 w-24 bg-slate-200 rounded mb-8" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-5 h-5 rounded bg-slate-200" />
                        <div className="h-4 w-20 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main Content */}
                <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="h-6 w-32 bg-slate-200 rounded" />
                    <div className="h-8 w-8 rounded-full bg-blue-100" />
                  </div>
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-24 flex flex-col justify-between">
                        <div className="h-4 w-16 bg-slate-100 rounded" />
                        <div className="h-8 w-12 bg-blue-100 rounded" />
                      </div>
                    ))}
                  </div>
                  {/* Main Chart area */}
                  <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-50 to-transparent" />
                     <svg className="w-full h-full text-blue-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="currentColor" opacity="0.5"/>
                     </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
