"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Smooth mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 });
  
  // Transform values for parallax (reduced range for performance)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3, 3]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800"
    >
      {/* Animated gradient orbs - GPU accelerated */}
      <div className="absolute inset-0 overflow-hidden">
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
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] will-change-transform"
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
          className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-indigo-500/30 rounded-full blur-[120px] will-change-transform"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">AI-Powered School Operating System</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                The Future of
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  School Management
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Enterprise-grade ERP platform that automates operations, engages parents, and empowers educators with real-time intelligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth/login"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ x: "100%" }}
                  animate={{ x: isHovered ? "0%" : "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              
              <Link
                href="#demo"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Watch Demo
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Real-Time Sync</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm">10,000+ Schools</span>
              </div>
            </motion.div>
          </div>

          {/* Right: 3D Dashboard Preview */}
          <motion.div
            className="relative perspective-[1000px]"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            <Dashboard3DPreview />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// 3D Dashboard Preview Component
const Dashboard3DPreview = () => {
  return (
    <div className="relative">
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dashboard header */}
        <div className="h-14 border-b border-white/10 bg-slate-800/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <span className="text-sm text-slate-400 font-medium">Admin Dashboard</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
        </div>

        {/* Dashboard content */}
        <div className="p-6 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Students", value: "2,847", trend: "+12%", color: "blue" },
              { label: "Attendance", value: "94.2%", trend: "+2.1%", color: "green" },
              { label: "Revenue", value: "₹8.4L", trend: "+18%", color: "purple" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/5"
                style={{ transform: `translateZ(${(i + 1) * 20}px)` }}
              >
                <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">{stat.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/5 h-48 relative overflow-hidden"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
              {[65, 78, 82, 70, 88, 92, 85, 90, 95, 88, 92, 98].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-blue-500/50 to-indigo-500/50 rounded-t"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating notification cards */}
      <FloatingCard
        delay={1.2}
        className="absolute -top-4 -right-4 w-64"
        style={{ transform: "translateZ(60px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Fee Collected</div>
            <div className="text-xs text-slate-400">₹45,000 from Class 10-A</div>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        delay={1.4}
        className="absolute -bottom-4 -left-4 w-56"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">New Admission</div>
            <div className="text-xs text-slate-400">Priya Sharma - Grade 9</div>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
};

// Floating card component
const FloatingCard = ({ 
  children, 
  delay, 
  className, 
  style 
}: { 
  children: React.ReactNode; 
  delay: number; 
  className?: string;
  style?: React.CSSProperties;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-xl ${className}`}
    style={{
      ...style,
      transformStyle: "preserve-3d",
    }}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  </motion.div>
);
