"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to set up the system?",
    answer: "Most schools are up and running within 2-3 days. Our dedicated onboarding team handles data migration, system configuration, and staff training. We provide step-by-step guidance and ensure a smooth transition from your existing system.",
  },
  {
    question: "Is my school's data secure?",
    answer: "Absolutely. We use bank-grade 256-bit encryption, regular security audits, and comply with international standards including ISO 27001, GDPR, and SOC 2 Type II. Your data is backed up daily across multiple secure locations with 99.9% uptime guarantee.",
  },
  {
    question: "Can I manage multiple campuses?",
    answer: "Yes! Our Growth and Enterprise plans support multi-campus management. You can manage multiple branches from a single dashboard while maintaining separate data, reports, and permissions for each campus. Centralized oversight with campus-level autonomy.",
  },
  {
    question: "Do parents get their own mobile app?",
    answer: "Yes, we provide native iOS and Android apps for both parents and teachers. Parents can track attendance, view grades, pay fees, communicate with teachers, and receive real-time notifications—all from their smartphones with offline support.",
  },
  {
    question: "Can I customize the system for my school's needs?",
    answer: "Absolutely. Our platform is highly configurable with custom fields, workflows, report templates, and permission settings. Enterprise customers get access to custom development, API integrations, and white-label options to match your brand.",
  },
  {
    question: "What kind of training and support do you provide?",
    answer: "We provide comprehensive onboarding training for all staff, video tutorials, detailed documentation, and ongoing support. Starter plans get email support, Growth plans get priority support, and Enterprise customers get a dedicated account manager with 24/7 phone support.",
  },
  {
    question: "Can I import data from my existing system?",
    answer: "Yes! We support data migration from Excel, CSV, and most popular school management systems. Our team handles the entire migration process, ensuring data accuracy and integrity. We also provide validation reports and testing before going live.",
  },
  {
    question: "What happens if I need to cancel?",
    answer: "You can cancel anytime with no penalties. We provide a full data export in standard formats (Excel, CSV, PDF) so you retain complete ownership of your information. We also offer a 30-day grace period to ensure smooth transition if needed.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Got questions?{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              We've got answers
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 leading-relaxed">
            Everything you need to know about our platform and services
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6">
            Our team is here to help you find the perfect solution for your school
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Schedule a Demo
            </a>
            <a
              href="mailto:support@edumanage.com"
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ item component
const FAQItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: typeof faqs[0];
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-blue-500 shadow-lg shadow-blue-500/10"
          : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Question */}
      <button
        onClick={onClick}
        className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left group"
      >
        <span className={`text-lg font-semibold transition-colors ${
          isOpen ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"
        }`}>
          {faq.question}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            isOpen
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
          }`}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-6 text-slate-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
