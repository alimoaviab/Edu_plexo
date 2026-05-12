"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConstraintSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    reason?: string;
}

export function ConstraintSidebar({ isOpen, onClose, title, message, reason }: ConstraintSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] z-[10000]"
                    />

                    {/* Sidebar Panel */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-[10001] shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.25)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <span className="material-symbols-outlined text-amber-600">gavel</span>
                                </div>
                                <div>
                                    <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">System Constraint</h2>
                                    <p className="text-[10px] font-bold text-slate-400 normal-case mt-0.5">Policy Enforcement</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                                    {title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            {/* visual Indicator */}
                            <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden shadow-xl shadow-slate-900/20">
                                <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 h-32 w-32 bg-white/5 rounded-full blur-3xl" />
                                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                    <div className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <span className="material-symbols-outlined text-4xl text-amber-400">lock_open</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Required Action</p>
                                        <p className="text-sm font-bold leading-snug">Ensure at least one active cycle is maintained to prevent system-wide data loss.</p>
                                    </div>
                                </div>
                            </div>

                            {reason && (
                                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">Technical Reason</p>
                                    <p className="text-xs font-bold text-amber-900 leading-relaxed italic">"{reason}"</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operational Guidelines</h4>
                                <ul className="space-y-3">
                                    {[
                                        "Activate a new session before archiving this one.",
                                        "Ensure all pending grade sheets are closed.",
                                        "Verify class enrollment transitions are mapped."
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 mt-0.5">{i + 1}</span>
                                            <span className="text-xs font-bold text-slate-600 leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                            <button
                                onClick={onClose}
                                className="w-full h-12 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                Acknowledge & Close
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
