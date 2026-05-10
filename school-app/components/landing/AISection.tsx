"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";

const aiFeatures = [
  {
    icon: TrendingUp,
    title: "Performance Prediction",
    description: "AI analyzes student patterns to predict academic performance and identify at-risk students before they fall behind.",
    metric: "94% Accuracy",
  },
  {
    icon: AlertCircle,
    title: "Fee Defaulter Detection",
    description: "Machine learning identifies payment patterns and predicts potential defaulters, enabling proactive communication.",
    metric: "87% Early Detection",
  },
  {
    icon: FileText,
    title: "Automated Report Generation",
    description: "Generate comprehensive reports, insights, and summaries with natural language processing in seconds.",
    metric: "10x Faster",
  },
  {
    icon: Target,
    title: "Attendance Insights",
    description: "Detect attendance patterns, predict absenteeism, and receive intelligent recommendations for intervention.",
    metric: "Real-time Analysis",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "Get AI-powered suggestions for class assignments, teacher allocation, and resource optimization.",
    metric: "Continuous Learning",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Forecast enrollment trends, revenue projections, and operational needs with advanced data modeling.",
    metric: "6-Month Forecast",
  },
];

export const AISection = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#3B82F6" opacity="0.5" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="50" x2="50" y2="100" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>

        {/* Glowing orbs */}
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
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px]"
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
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            <Brain className="w-4 h-4" />
            Powered by Artificial Intelligence
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Intelligence that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              transforms operations
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed">
            Our AI engine analyzes millions of data points to provide actionable insights, automate workflows, and predict outcomes before they happen.
          </p>
        </motion.div>

        {/* AI visualization center piece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mb-20"
        >
          {/* Central AI brain */}
          <div className="relative">
            {/* Pulsing core */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl"
            />
            
            {/* Main brain icon */}
            <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative"
              >
                <Brain className="w-24 h-24 text-blue-400" />
                
                {/* Orbiting particles */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: [-angle, -angle + 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transformOrigin: "0 0",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                      style={{
                        transform: `translate(-50%, -50%) translateX(80px)`,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Floating data nodes */}
            {[
              { icon: TrendingUp, position: "top-0 left-1/4", delay: 0 },
              { icon: AlertCircle, position: "top-1/4 right-0", delay: 0.2 },
              { icon: FileText, position: "bottom-0 right-1/4", delay: 0.4 },
              { icon: Target, position: "bottom-1/4 left-0", delay: 0.6 },
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: node.delay }}
                className={`absolute ${node.position} -translate-x-1/2 -translate-y-1/2`}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="w-16 h-16 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl"
                >
                  <node.icon className="w-8 h-8 text-blue-400" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 h-full">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                    <Zap className="w-3 h-3" />
                    {feature.metric}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-6">
            Experience the power of AI-driven school management
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
          >
            <Brain className="w-5 h-5" />
            Explore AI Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
