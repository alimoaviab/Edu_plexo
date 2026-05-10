"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "EduManage completely transformed how we run our daily operations. Attendance takes seconds, and parent communication has never been easier.",
    author: "Sarah Jenkins",
    role: "School Principal, Oakridge Academy",
    avatar: "SJ"
  },
  {
    content: "Finally, a school management system that doesn't feel like it was built in the 90s. The UI is gorgeous and incredibly intuitive for our staff.",
    author: "David Chen",
    role: "IT Director, Summit Prep",
    avatar: "DC"
  },
  {
    content: "As a teacher, I save at least 5 hours a week on administrative tasks. The automated grading and report card generation is a lifesaver.",
    author: "Elena Rodriguez",
    role: "Senior Educator, Global Heights",
    avatar: "ER"
  }
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6"
          >
            <Star className="w-4 h-4 fill-blue-600" />
            Trusted by 10,000+ Schools
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              educators worldwide
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 leading-relaxed"
          >
            Don't just take our word for it. Hear from the administrators and teachers who use EduManage every day.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Card */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed mb-8">
                    "{t.content}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-600">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
