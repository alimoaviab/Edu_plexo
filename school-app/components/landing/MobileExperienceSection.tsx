"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Bell, Clock, CalendarDays } from "lucide-react";

export const MobileExperienceSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Mobile Phone Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Background glows */}
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20 transform -translate-y-10" />

              {/* Phone Frame */}
              <div className="w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-slate-800">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20" />

                {/* Screen */}
                <div className="w-full h-full bg-slate-50 rounded-[2.25rem] overflow-hidden relative flex flex-col">
                   {/* Mobile Header */}
                   <div className="bg-blue-600 p-6 pb-8 text-white rounded-b-[2rem]">
                      <div className="flex justify-between items-center mb-6 mt-4">
                         <div className="w-8 h-8 bg-white/20 rounded-full" />
                         <div className="w-8 h-8 bg-white/20 rounded-full" />
                      </div>
                      <div className="text-sm text-blue-100 mb-1">Good Morning,</div>
                      <div className="text-xl font-bold">Sarah Parent</div>
                   </div>

                   {/* Mobile Content */}
                   <div className="flex-1 p-4 -mt-4">
                      {/* Stats Card */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 flex justify-between items-center">
                         <div>
                            <div className="text-xs text-slate-500 mb-1">Attendance</div>
                            <div className="text-lg font-bold text-slate-900">98%</div>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold">A+</div>
                      </div>

                      {/* Notifications */}
                      <div className="space-y-3">
                         <div className="text-sm font-semibold text-slate-900 mb-2">Recent Updates</div>
                         {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex gap-3 items-center">
                               <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0" />
                               <div className="flex-1">
                                  <div className="h-3 w-3/4 bg-slate-200 rounded mb-2" />
                                  <div className="h-2 w-1/2 bg-slate-100 rounded" />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Bottom Nav */}
                   <div className="h-16 bg-white border-t border-slate-100 flex justify-around items-center px-6">
                      {[1, 2, 3, 4].map(i => (
                         <div key={i} className={`w-6 h-6 rounded ${i === 1 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6"
            >
               <Smartphone className="w-4 h-4" />
               <span>Always Connected</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              School updates, <br />
              <span className="text-blue-600">right in their pocket.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10"
            >
              Our mobile-first parent portal ensures families never miss a beat. From real-time attendance to instant fee payment, everything is just a tap away.
            </motion.p>

            <div className="space-y-6">
              {[
                { icon: Bell, text: "Instant push notifications for emergencies and updates" },
                { icon: Clock, text: "Real-time attendance tracking and alerts" },
                { icon: CalendarDays, text: "Interactive school calendar and event RSVPs" }
              ].map((item, i) => (
                <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 + (i * 0.1) }}
                   className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                >
                   <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-slate-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
