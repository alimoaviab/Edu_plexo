"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to transform your school?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Join hundreds of innovative schools that trust EduManage to power their daily operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-medium shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-medium hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center"
              >
                Book a Demo
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free data migration
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
