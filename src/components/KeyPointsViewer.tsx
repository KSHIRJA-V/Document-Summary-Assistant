"use client";

import React, { useState } from "react";
import { Calendar, DollarSign, CheckSquare, Tag, Building, Sparkles, Check } from "lucide-react";
import { ExtractedEntities } from "@/types";

interface KeyPointsViewerProps {
  entities: ExtractedEntities;
}

export const KeyPointsViewer: React.FC<KeyPointsViewerProps> = ({ entities }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      
      {/* Action Items & Deliverables */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <CheckSquare className="w-4 h-4 text-[#5dd667]" />
          <span>Action Items & High-Priority Responsibilities</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667]">
            {entities.actionItems.length} items
          </span>
        </h3>

        <div className="space-y-2.5">
          {entities.actionItems.map((action, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-slate-50 dark:bg-unthinkable-card/30 border-slate-200 dark:border-unthinkable-border opacity-60"
                    : "bg-white dark:bg-unthinkable-card border-slate-200 dark:border-unthinkable-border hover:border-[#5dd667]/50 shadow-sm"
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-all ${
                    isChecked
                      ? "bg-[#5dd667] border-[#5dd667] text-[#0b0f17]"
                      : "border-slate-300 dark:border-unthinkable-borderLight hover:border-[#5dd667]"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <p
                  className={`text-sm leading-relaxed ${
                    isChecked
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {action}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dates & Milestones */}
        <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Extracted Dates & Milestones</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {entities.datesAndDeadlines.map((date, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5"
                >
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span>{date}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-unthinkable-textDim mt-4 pt-3 border-t border-slate-100 dark:border-unthinkable-border">
            Schedules, deadlines, and fiscal target dates detected in document text.
          </p>
        </div>

        {/* Metrics & Figures */}
        <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-[#5dd667]" />
              <span>Quantitative Metrics & Numbers</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {entities.metricsAndNumbers.map((metric, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#5dd667]/15 dark:bg-[#5dd667]/10 border border-[#5dd667]/30 text-xs font-bold text-[#1e6124] dark:text-[#5dd667] flex items-center gap-1.5"
                >
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-unthinkable-textDim mt-4 pt-3 border-t border-slate-100 dark:border-unthinkable-border">
            Financial figures, SLA percentages, throughput benchmarks, and totals.
          </p>
        </div>

      </div>

      {/* Core Topics & Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Terminology */}
        <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-purple-500" />
            <span>Key Terminology & Topic Keywords</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {entities.keyTermsAndTopics.map((term, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs font-medium text-purple-800 dark:text-purple-300"
              >
                #{term}
              </span>
            ))}
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Named Organizations & Entities</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {entities.organizationsAndNames.map((org, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold text-amber-800 dark:text-amber-300"
              >
                {org}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
