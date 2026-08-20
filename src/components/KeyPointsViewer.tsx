"use client";

import React, { useState } from "react";
import { Calendar, DollarSign, CheckSquare, Tag, Building, Check } from "lucide-react";
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
    <div className="space-y-4">
      
      {/* Action Items */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Action Items & Tasks</span>
        </h3>

        <div className="space-y-2">
          {entities.actionItems.map((action, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3 rounded-lg border flex items-start space-x-3 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60"
                    : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                    isChecked
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Dates & Milestones */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Dates & Deadlines</span>
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {entities.datesAndDeadlines.map((date, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {date}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics & Figures */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Numbers & Metrics</span>
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {entities.metricsAndNumbers.map((metric, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Topics & Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Key Terminology */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-purple-500" />
            <span>Key Terms</span>
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {entities.keyTermsAndTopics.map((term, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                #{term}
              </span>
            ))}
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-amber-500" />
            <span>Entities & Names</span>
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {entities.organizationsAndNames.map((org, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
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
