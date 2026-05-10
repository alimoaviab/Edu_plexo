"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Users, School, TrendingUp, Award, Globe, Zap } from "lucide-react";

const stats = [
  {
    icon: School,
    value: 10000,
    suffix: "+",
    label: "Schools Trust Us",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Users,
    value: 2.5,
    suffix: "M+",
    label: "Students Managed",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    value: 98.5,
    suffix: "%",
    label: "Customer Satisfaction",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Globe,
    value: 45,
    suffix: "+",
    label: "Countries Worldwide",
    color: "from-amber-500 to-orange-600",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            <Award className="w-4 h-4" />
            Trusted by Educational Institutions Worldwide
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            The numbers speak for themselves
          </h2>
          
          <p className="text-xl text-slate-300">
            Join thousands of schools transforming education with our platform
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { icon: Award, text: "ISO 27001 Certified" },
            { icon: Shield, text: "GDPR Compliant" },
            { icon: Zap, text: "99.9% Uptime" },
            { icon: Award, text: "SOC 2 Type II" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-white/10"
            >
              <badge.icon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-slate-300">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Animated stat card component
const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      motionValue.set(stat.value);
    }
  }, [isInView, hasAnimated, motionValue, stat.value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (stat.suffix === "M+") {
        setDisplayValue(latest.toFixed(1));
      } else if (stat.suffix === "%") {
        setDisplayValue(latest.toFixed(1));
      } else {
        setDisplayValue(Math.floor(latest).toLocaleString());
      }
    });

    return unsubscribe;
  }, [springValue, stat.suffix]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
      
      {/* Card */}
      <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon className="w-7 h-7 text-white" />
        </div>

        {/* Value */}
        <div className="mb-2">
          <span className="text-5xl font-bold text-white">
            {displayValue}
          </span>
          <span className="text-3xl font-bold text-white">
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <p className="text-slate-400 font-medium">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
};

// Import Shield icon
import { Shield } from "lucide-react";
