"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/30 rounded-full blur-[120px]"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm text-blue-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            Join 10,000+ Schools Worldwide
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Ready to transform
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              your school?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Start your 14-day free trial today. No credit card required. Experience the future of school management.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/login"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/60 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ x: "100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <Link
              href="#demo"
              className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-3"
            >
              Schedule Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            {[
              { icon: Shield, text: "Bank-Grade Security" },
              { icon: Zap, text: "99.9% Uptime" },
              { icon: Users, text: "24/7 Support" },
              { icon: CheckCircle, text: "No Credit Card" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-slate-400"
              >
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-slate-900"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-300">
                <span className="font-bold text-white">2,500+</span> schools rated us 5 stars
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
