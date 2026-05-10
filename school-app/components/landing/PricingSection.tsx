"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter School",
    description: "Perfect for small schools getting started",
    monthlyPrice: 4000,
    yearlyPrice: 40000,
    students: "Up to 200 Students",
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    features: [
      "Student & Teacher Management",
      "Attendance Tracking",
      "Fee Management",
      "Parent Portal Access",
      "Basic Reports & Analytics",
      "Email Support",
      "Mobile App Access",
      "Cloud Storage (10GB)",
    ],
    popular: false,
  },
  {
    name: "Growth School",
    description: "For growing schools with advanced needs",
    monthlyPrice: 8000,
    yearlyPrice: 80000,
    students: "Up to 500 Students",
    icon: Sparkles,
    color: "from-purple-500 to-pink-600",
    features: [
      "Everything in Starter, plus:",
      "AI-Powered Insights",
      "Advanced Analytics Dashboard",
      "Exam & Result Management",
      "Live Class Integration",
      "SMS & WhatsApp Notifications",
      "Priority Support",
      "Cloud Storage (50GB)",
      "Custom Report Builder",
      "Multi-Campus Support (2 campuses)",
    ],
    popular: true,
  },
  {
    name: "Enterprise School",
    description: "For large institutions with complex requirements",
    monthlyPrice: null,
    yearlyPrice: null,
    students: "800+ Students",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    features: [
      "Everything in Growth, plus:",
      "Unlimited Students & Staff",
      "Custom AI Model Training",
      "Advanced Security & Compliance",
      "Dedicated Account Manager",
      "24/7 Phone Support",
      "Custom Integrations",
      "Unlimited Cloud Storage",
      "White-Label Options",
      "Multi-Campus Support (Unlimited)",
      "Custom Development",
      "On-Premise Deployment Option",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Simple, Transparent Pricing
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Choose the perfect plan for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              your school
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-8 bg-slate-200 rounded-full transition-colors hover:bg-slate-300"
          >
            <motion.div
              animate={{ x: billingCycle === "monthly" ? 2 : 26 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-blue-600 rounded-full shadow-md"
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-500"}`}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
            >
              Save 17%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold shadow-lg`}>
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative bg-white rounded-2xl border-2 ${
                  plan.popular ? "border-blue-500 shadow-2xl shadow-blue-500/20" : "border-slate-200 shadow-lg"
                } p-8 h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? "hover:shadow-blue-500/30" : ""
                }`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {plan.description}
                </p>

                {/* Student capacity */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold mb-6">
                  {plan.students}
                </div>

                {/* Price */}
                <div className="mb-8">
                  {plan.monthlyPrice ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={billingCycle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-slate-900">
                            ₹{billingCycle === "monthly" ? plan.monthlyPrice.toLocaleString() : plan.yearlyPrice?.toLocaleString()}
                          </span>
                          <span className="text-slate-600">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p className="text-sm text-green-600 mt-2">
                            Save ₹{((plan.monthlyPrice * 12) - (plan.yearlyPrice || 0)).toLocaleString()} per year
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div>
                      <div className="text-5xl font-bold text-slate-900 mb-2">Custom</div>
                      <p className="text-slate-600">Contact us for pricing</p>
                    </div>
                  )}
                </div>

                {/* CTA button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-full font-semibold shadow-lg transition-all mb-8 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl`
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.monthlyPrice ? "Start Free Trial" : "Contact Sales"}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Features list */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${feature.includes("Everything in") ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-600 mb-4">
            All plans include free onboarding, training, and regular updates
          </p>
          <a href="#demo" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Need help choosing? Talk to our team →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
