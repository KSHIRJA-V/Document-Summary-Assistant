"use client";

import React from "react";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  Sliders,
  MessageSquare,
} from "lucide-react";
import { ImprovementSuggestion, ReadabilityMetrics } from "@/types";

interface SuggestionsViewerProps {
  metrics: ReadabilityMetrics;
  suggestions: ImprovementSuggestion[];
}

export const SuggestionsViewer: React.FC<SuggestionsViewerProps> = ({
  metrics,
  suggestions,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500 border-emerald-500 bg-emerald-500/10";
    if (score >= 50) return "text-blue-500 border-blue-500 bg-blue-500/10";
    if (score >= 30) return "text-amber-500 border-amber-500 bg-amber-500/10";
    return "text-red-500 border-red-500 bg-red-500/10";
  };

  const getSeverityBadge = (severity: ImprovementSuggestion["severity"]) => {
    switch (severity) {
      case "high":
        return {
          bg: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40",
          icon: AlertTriangle,
          label: "High Priority",
        };
      case "medium":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
          icon: AlertTriangle,
          label: "Medium Priority",
        };
      case "low":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
          icon: Info,
          label: "Minor Optimization",
        };
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
          icon: CheckCircle2,
          label: "Well Executed",
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Banner */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-unthinkable-border">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#5dd667]" />
              <span>Readability & Document Quality Metrics</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted mt-1">
              Flesch-Kincaid formula evaluation and linguistic cadence analysis.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667] border border-[#5dd667]/30">
              Tone: {metrics.sentimentTone}
            </span>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Flesch Reading Ease */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim uppercase tracking-wider block mb-1">
              Reading Ease
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1 font-mono">
              {metrics.fleschReadingEase}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-[11px] font-bold text-[#5dd667]">
              {metrics.complexityBadge}
            </span>
          </div>

          {/* Flesch Grade */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim uppercase tracking-wider block mb-1">
              Grade Level
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1 font-mono">
              {metrics.fleschKincaidGrade}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-unthinkable-textMuted truncate block">
              {metrics.readingGradeLabel.split("(")[0]}
            </span>
          </div>

          {/* Sentence Length */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim uppercase tracking-wider block mb-1">
              Avg Sentence Length
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1 font-mono">
              {metrics.avgSentenceLengthWords}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-unthinkable-textMuted">
              words / sentence
            </span>
          </div>

          {/* Passive Voice */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim uppercase tracking-wider block mb-1">
              Passive Voice
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white my-1 font-mono">
              {metrics.passiveVoicePercentage}%
            </div>
            <span className="text-[11px] text-slate-500 dark:text-unthinkable-textMuted">
              {metrics.passiveVoicePercentage > 20 ? "High frequency" : "Healthy cadence"}
            </span>
          </div>

        </div>

      </div>

      {/* Actionable Improvement Suggestions List */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-unthinkable-border">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#5dd667]" />
              <span>Actionable Improvement Recommendations</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted mt-0.5">
              Specific edits to enhance executive impact, structure, and readability.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-unthinkable-card text-slate-700 dark:text-slate-300">
            {suggestions.length} suggestions
          </span>
        </div>

        <div className="space-y-4">
          {suggestions.map((sug) => {
            const badge = getSeverityBadge(sug.severity);
            const Icon = badge.icon;

            return (
              <div
                key={sug.id}
                className="p-5 rounded-xl bg-slate-50/70 dark:bg-unthinkable-card/60 border border-slate-200 dark:border-unthinkable-border transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}
                    >
                      <Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-unthinkable-textDim uppercase tracking-wide">
                      Category: {sug.category.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                  {sug.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-unthinkable-textMuted mt-1 leading-relaxed">
                  {sug.description}
                </p>

                {/* Recommendation & Impact */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-unthinkable-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-unthinkable-panel border border-slate-200/80 dark:border-unthinkable-border/80">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      💡 Recommendation:
                    </span>
                    <span className="text-slate-600 dark:text-unthinkable-textMuted leading-relaxed">
                      {sug.recommendation}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#5dd667]/10 dark:bg-[#5dd667]/5 border border-[#5dd667]/20">
                    <span className="font-bold text-[#1e6124] dark:text-[#5dd667] block mb-0.5">
                      🚀 Expected Impact:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sug.impact}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
