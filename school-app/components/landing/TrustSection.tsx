"use client";

import React from "react";
import { motion } from "framer-motion";

export const TrustSection = () => {
  const stats = [
    { value: "500+", label: "Schools Worldwide" },
    { value: "2M+", label: "Students Managed" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Expert Support" },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-8">
            Trusted by innovative educational institutions globally
          </p>

          {/* Fake Logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {["Global Academy", "Pioneer High", "Future Minds", "Summit Prep", "Nova School"].map((name, i) => (
                <div key={i} className="text-xl md:text-2xl font-bold text-slate-400 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-slate-200" />
                   {name}
                </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-slate-500 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
