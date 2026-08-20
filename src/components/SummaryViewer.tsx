"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Layers } from "lucide-react";
import { SummaryData, SummaryLength } from "@/types";
import { copyToClipboard } from "@/lib/export-utils";

interface SummaryViewerProps {
  summaries: {
    short: SummaryData;
    medium: SummaryData;
    long: SummaryData;
  };
  activeLength: SummaryLength;
  onChangeLength: (length: SummaryLength) => void;
  onOpenExportModal: () => void;
  documentTitle: string;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({
  summaries,
  activeLength,
  onChangeLength,
  onOpenExportModal,
  documentTitle,
}) => {
  const [copied, setCopied] = useState(false);

  const currentSummary = summaries[activeLength] || summaries.medium;

  const handleCopy = async () => {
    const textToCopy = `${currentSummary.headline}\n\nOVERVIEW:\n${currentSummary.overview}\n\nKEY POINTS:\n${currentSummary.keyTakeaways.map((t) => `• ${t}`).join("\n")}`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Control Bar: Length Selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Length Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
            Summary Length:
          </span>
          <button
            onClick={() => onChangeLength("short")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeLength === "short"
                ? "bg-emerald-600 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Short
          </button>
          <button
            onClick={() => onChangeLength("medium")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeLength === "medium"
                ? "bg-emerald-600 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => onChangeLength("long")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeLength === "long"
                ? "bg-emerald-600 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Long
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{documentTitle}</span>
          <span>~{currentSummary.wordCount} words</span>
        </div>

        {/* Headline */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-4 leading-snug">
          {currentSummary.headline}
        </h3>

        {/* Overview */}
        <div className="mt-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentSummary.overview}
        </div>

        {/* Key Points */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Key Points
          </h4>

          <ul className="space-y-2">
            {currentSummary.keyTakeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span>
                <div>{takeaway}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Sections */}
        {currentSummary.sections && currentSummary.sections.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Section Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSummary.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"
                >
                  <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {sec.title}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
