import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Schools Using EduPlexo" },
  { value: "15k+", label: "Active Students Managed" },
  { value: "99.9%", label: "School ERP Uptime" },
  { value: "24/7", label: "Priority Support" }
];

export const TrustSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800 relative overflow-hidden transition-colors duration-300" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            id="trust-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight"
          >
            TRUSTED BY FORWARD-THINKING SCHOOLS WORLDWIDE
          </motion.h2>

          {/* School Logos Mock */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
             {["Oakridge Academy", "Summit Prep", "Global Heights", "Pioneer Valley", "Crestwood High"].map((name, i) => (
                <div key={i} className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                   <div
                     className={`w-8 h-8 rounded-full shadow-sm ${
                       i === 0
                         ? "bg-blue-600 dark:bg-blue-500"
                         : i === 1
                           ? "bg-emerald-600 dark:bg-emerald-500"
                           : i === 2
                             ? "bg-amber-600 dark:bg-amber-500"
                             : i === 3
                               ? "bg-rose-600 dark:bg-rose-500"
                               : "bg-violet-600 dark:bg-violet-500"
                     }`}
                   />
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
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-semibold normal-case">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
