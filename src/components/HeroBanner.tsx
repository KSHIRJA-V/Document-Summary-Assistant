"use client";

import React from "react";
import { Sparkles, Scan, FileCheck, CheckCircle2, Shield, Zap } from "lucide-react";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-200 dark:border-unthinkable-border bg-slate-50 dark:bg-[#0b0f17]">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5dd667]/10 dark:bg-[#5dd667]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#5dd667]/15 dark:bg-[#5dd667]/10 border border-[#5dd667]/30 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#5dd667]" />
          <span className="text-xs font-semibold text-slate-800 dark:text-[#5dd667] tracking-wide">
            Enterprise Technical Assessment Project
          </span>
        </div>

        {/* Unthinkable Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Believe in being{" "}
          <span className="text-[#5dd667] underline decoration-[#5dd667]/40 underline-offset-8">
            Fundamentally different?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-unthinkable-textMuted max-w-2xl mx-auto font-normal leading-relaxed">
          The next-generation <strong className="text-slate-900 dark:text-slate-200">Document Summary Assistant</strong>. Instantly parse PDFs, run neural OCR on scanned images, generate structured multi-tier executive summaries, and receive actionable writing improvement suggestions.
        </p>

        {/* Feature Badges Grid */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto text-xs font-medium">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 shadow-sm">
            <Scan className="w-3.5 h-3.5 text-[#5dd667]" />
            <span>PDF Parsing & Tesseract OCR</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 shadow-sm">
            <FileCheck className="w-3.5 h-3.5 text-[#5dd667]" />
            <span>3 Summary Lengths (Short / Med / Long)</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#5dd667]" />
            <span>Clarity & Readability Engine</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#5dd667]" />
            <span>Zero Server Tracking (Client Privacy)</span>
          </div>
        </div>

      </div>
    </section>
  );
};
