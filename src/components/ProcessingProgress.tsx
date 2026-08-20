"use client";

import React from "react";
import { Loader2 } from "lucide-react";
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
  const { progress, message } = progressState;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 text-center shadow-sm">
        
        <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Processing Document
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-sm mx-auto">
          {fileName}
        </p>

        {/* Progress Bar */}
        <div className="mt-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{message}</span>
          <span className="font-mono font-medium">{progress}%</span>
        </div>

        {onCancel && (
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
