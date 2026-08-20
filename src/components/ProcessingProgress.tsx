"use client";

import React from "react";
import { Loader2, FileCheck, CheckCircle2, AlertCircle, Scan, Sparkles, Brain } from "lucide-react";
import { ProgressState } from "@/types";

interface ProcessingProgressProps {
  progressState: ProgressState;
  fileName: string;
  onCancel?: () => void;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  progressState,
  fileName,
  onCancel,
}) => {
  const { step, progress, message, error } = progressState;

  const steps = [
    { key: "uploading", label: "Document Ingestion", icon: FileCheck },
    { key: "extracting_pdf", label: "PDF / OCR Extraction", icon: Scan },
    { key: "generating_summary", label: "NLP Summarization", icon: Sparkles },
    { key: "analyzing_readability", label: "Clarity & Suggestions", icon: Brain },
  ];

  const getStepStatus = (stepKey: string) => {
    if (error) return "error";
    if (step === "ready") return "completed";
    if (step === stepKey) return "active";

    const order = ["uploading", "extracting_pdf", "running_ocr", "generating_summary", "analyzing_readability", "ready"];
    const currentIndex = order.indexOf(step === "running_ocr" ? "extracting_pdf" : step);
    const stepIndex = order.indexOf(stepKey);

    if (currentIndex > stepIndex) return "completed";
    return "pending";
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-dark-card text-center">
        
        {/* Animated Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#5dd667]/15 dark:bg-[#5dd667]/10 border border-[#5dd667]/30 flex items-center justify-center mb-5 shadow-emerald-sm relative">
          <Loader2 className="w-8 h-8 text-[#5dd667] animate-spin" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Processing Document Intelligence
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-unthinkable-textMuted mt-1 font-medium truncate max-w-md mx-auto">
          {fileName}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-100 dark:bg-unthinkable-card rounded-full h-3 overflow-hidden border border-slate-200 dark:border-unthinkable-border p-0.5">
          <div
            className="bg-gradient-to-r from-[#5dd667] to-[#4ec257] h-full rounded-full transition-all duration-300 shadow-emerald-sm"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-unthinkable-textDim">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{message}</span>
          <span className="font-mono font-bold text-[#5dd667]">{progress}%</span>
        </div>

        {/* Step Progression Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-unthinkable-border">
          {steps.map((s, idx) => {
            const status = getStepStatus(s.key);
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  status === "active"
                    ? "border-[#5dd667] bg-[#5dd667]/10 dark:bg-[#5dd667]/5 text-slate-900 dark:text-white"
                    : status === "completed"
                    ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                    : "border-slate-200 dark:border-unthinkable-border bg-slate-50 dark:bg-unthinkable-card/50 text-slate-400 dark:text-unthinkable-textDim"
                }`}
              >
                <div className="flex items-center justify-center mb-1.5">
                  {status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : status === "active" ? (
                    <Loader2 className="w-4 h-4 text-[#5dd667] animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 opacity-50" />
                  )}
                </div>
                <span className="text-[11px] font-semibold block leading-tight">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {onCancel && (
          <div className="mt-6">
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel Extraction
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
