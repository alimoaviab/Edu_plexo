"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Layout, Users, Shield } from "lucide-react";

export const DashboardShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: "analytics", label: "Analytics UI", icon: LineChart },
    { id: "admin", label: "Admin Dashboard", icon: Layout },
    { id: "students", label: "Student Records", icon: Users },
    { id: "security", label: "Access Control", icon: Shield },
  ];

  return (
    <section id="dashboard" className="py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Content Left */}
          <div className="w-full lg:w-1/3">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Designed for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">maximum clarity</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 mb-10 leading-relaxed"
            >
              We stripped away the noise to give you an interface that is as powerful as it is beautiful. Data you need, right when you need it.
            </motion.p>

            <div className="space-y-4">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                        : "bg-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Right Screen */}
          <div className="w-full lg:w-2/3 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10" />

            <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] shadow-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10] relative flex flex-col">
               {/* Browser Header Fake */}
               <div className="h-12 border-b border-slate-200 bg-white/50 backdrop-blur flex items-center px-4 gap-2 z-20">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-slate-300" />
                   <div className="w-3 h-3 rounded-full bg-slate-300" />
                   <div className="w-3 h-3 rounded-full bg-slate-300" />
                 </div>
               </div>

               {/* Screen Content Area */}
               <div className="flex-1 relative p-6 bg-slate-50 overflow-hidden">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                     animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                     exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                     transition={{ duration: 0.3 }}
                     className="absolute inset-0 p-6 flex flex-col gap-4"
                   >
                      {activeTab === 0 && (
                        <>
                          <div className="h-8 w-48 bg-slate-200 rounded-md mb-2" />
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-24 shadow-sm border border-slate-100" />)}
                          </div>
                          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-50 to-transparent" />
                          </div>
                        </>
                      )}
                      {activeTab === 1 && (
                         <div className="flex h-full gap-4">
                            <div className="w-48 bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col gap-2 p-3">
                               <div className="h-6 w-full bg-slate-100 rounded mb-4" />
                               {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-full bg-slate-50 rounded" />)}
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                               <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-100" />
                               <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100" />
                            </div>
                         </div>
                      )}
                      {activeTab === 2 && (
                        <div className="flex flex-col h-full gap-4">
                           <div className="flex justify-between">
                             <div className="h-10 w-64 bg-white rounded-lg shadow-sm border border-slate-100" />
                             <div className="h-10 w-32 bg-blue-600 rounded-lg shadow-sm" />
                           </div>
                           <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                              <div className="h-8 bg-slate-50 rounded w-full mb-2" />
                              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-50/50 rounded w-full" />)}
                           </div>
                        </div>
                      )}
                      {activeTab === 3 && (
                        <div className="flex h-full items-center justify-center">
                           <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-sm w-full text-center">
                             <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                             <div className="h-6 w-3/4 bg-slate-200 rounded mx-auto mb-4" />
                             <div className="h-4 w-full bg-slate-100 rounded mx-auto mb-2" />
                             <div className="h-4 w-5/6 bg-slate-100 rounded mx-auto mb-8" />
                             <div className="h-10 w-full bg-blue-600 rounded-lg" />
                           </div>
                        </div>
                      )}
                   </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
