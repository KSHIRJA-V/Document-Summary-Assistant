"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  CheckSquare,
  Zap,
  MessageSquare,
  FileCode,
  Eye,
  Download,
  RefreshCw,
  Share2,
} from "lucide-react";
import {
  DocumentAnalysisResult,
  SummaryFormat,
  SummaryLength,
  UploadedDocument,
  UserAppSettings,
} from "@/types";
import { SummaryViewer } from "./SummaryViewer";
import { KeyPointsViewer } from "./KeyPointsViewer";
import { SuggestionsViewer } from "./SuggestionsViewer";
import { DocumentQA } from "./DocumentQA";
import { ExtractedTextViewer } from "./ExtractedTextViewer";
import { DocumentVisualizer } from "./DocumentVisualizer";

interface DocumentWorkbenchProps {
  document: UploadedDocument;
  analysis: DocumentAnalysisResult;
  settings: UserAppSettings;
  onReset: () => void;
  onOpenExportModal: () => void;
}

type WorkbenchTab = "summary" | "key_points" | "suggestions" | "chat" | "extracted_text" | "visualizer";

export const DocumentWorkbench: React.FC<DocumentWorkbenchProps> = ({
  document,
  analysis,
  settings,
  onReset,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("summary");
  const [activeLength, setActiveLength] = useState<SummaryLength>("medium");
  const [activeFormat, setActiveFormat] = useState<SummaryFormat>("executive");

  const tabs: Array<{ id: WorkbenchTab; label: string; icon: any; count?: string | number }> = [
    { id: "summary", label: "Smart Summary", icon: Sparkles },
    { id: "key_points", label: "Key Points & Entities", icon: CheckSquare, count: analysis.extracted.wordCount > 0 ? "5 Areas" : undefined },
    { id: "suggestions", label: "Improvement Suggestions", icon: Zap, count: analysis.suggestions.length },
    { id: "chat", label: "Document Q&A", icon: MessageSquare },
    { id: "extracted_text", label: "Extracted Text", icon: FileCode, count: `${analysis.extracted.wordCount}w` },
    { id: "visualizer", label: "Document Preview", icon: Eye },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Document Header Banner */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667] border border-[#5dd667]/30">
              Active Document Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {document.id.slice(0, 12)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {document.name}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-unthinkable-textMuted font-mono">
            <span>Size: {(document.size / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span>Words: {analysis.extracted.wordCount.toLocaleString()}</span>
            <span>•</span>
            <span>Est. Read: ~{analysis.extracted.estimatedReadingMinutes} min</span>
            <span>•</span>
            <span className="text-[#2d7534] dark:text-[#5dd667] font-semibold">
              Readability: {analysis.readability.complexityBadge} ({analysis.readability.fleschReadingEase}/100)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:self-center">
          <button
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5dd667]" />
            <span>Upload Another</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 rounded-xl bg-[#5dd667] text-[#0b0f17] font-extrabold text-xs flex items-center gap-1.5 shadow-emerald-sm hover:bg-[#4ec257] transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-unthinkable-border overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-[#5dd667] text-[#2d7534] dark:text-[#5dd667] bg-[#5dd667]/5"
                    : "border-transparent text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-unthinkable-border"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#5dd667]" : "opacity-70"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive
                        ? "bg-[#5dd667]/20 text-[#2d7534] dark:text-[#5dd667]"
                        : "bg-slate-100 dark:bg-unthinkable-card text-slate-500 dark:text-unthinkable-textDim"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Panel Content */}
      <div className="pt-2">
        {activeTab === "summary" && (
          <SummaryViewer
            summaries={analysis.summaries}
            activeLength={activeLength}
            onChangeLength={setActiveLength}
            activeFormat={activeFormat}
            onChangeFormat={setActiveFormat}
            onOpenExportModal={onOpenExportModal}
            documentTitle={document.name}
          />
        )}

        {activeTab === "key_points" && (
          <KeyPointsViewer
            entities={analysis.summaries[activeLength]?.entities || analysis.summaries.medium.entities}
          />
        )}

        {activeTab === "suggestions" && (
          <SuggestionsViewer
            metrics={analysis.readability}
            suggestions={analysis.suggestions}
          />
        )}

        {activeTab === "chat" && (
          <DocumentQA
            documentText={analysis.extracted.cleanText}
            documentTitle={document.name}
            settings={settings}
          />
        )}

        {activeTab === "extracted_text" && (
          <ExtractedTextViewer
            data={analysis.extracted}
            documentTitle={document.name}
          />
        )}

        {activeTab === "visualizer" && (
          <DocumentVisualizer
            document={document}
            rawText={analysis.extracted.cleanText}
          />
        )}
      </div>

    </div>
  );
};
