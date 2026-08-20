"use client";

import React from "react";
import { FileText, Scan, Layers } from "lucide-react";

export const HeroBanner: React.FC = () => {
  return (
    <section className="pt-8 pb-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Document Summary Assistant
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Upload PDF files or scanned images to extract text using OCR and automatically generate smart summaries.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>PDF Parsing</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Scan className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Image OCR</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Smart Summaries</span>
          </div>
        </div>

      </div>
    </section>
  );
};
