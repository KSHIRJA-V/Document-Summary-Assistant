"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  CheckSquare,
  FileCode,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  DocumentAnalysisResult,
  SummaryLength,
  UploadedDocument,
  UserAppSettings,
} from "@/types";
import { SummaryViewer } from "./SummaryViewer";
import { KeyPointsViewer } from "./KeyPointsViewer";
import { ExtractedTextViewer } from "./ExtractedTextViewer";

interface DocumentWorkbenchProps {
  document: UploadedDocument;
  analysis: DocumentAnalysisResult;
  settings: UserAppSettings;
  onReset: () => void;
  onOpenExportModal: () => void;
}

type WorkbenchTab = "summary" | "key_points" | "extracted_text";

export const DocumentWorkbench: React.FC<DocumentWorkbenchProps> = ({
  document,
  analysis,
  onReset,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("summary");
  const [activeLength, setActiveLength] = useState<SummaryLength>("medium");

  const tabs: Array<{ id: WorkbenchTab; label: string; icon: any }> = [
    { id: "summary", label: "Smart Summary", icon: Sparkles },
    { id: "key_points", label: "Key Points", icon: CheckSquare },
    { id: "extracted_text", label: "Extracted Text", icon: FileCode },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      
      {/* Document Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-xl">
            {document.name}
          </h2>

          <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Size: {(document.size / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span>Words: {analysis.extracted.wordCount.toLocaleString()}</span>
            <span>•</span>
            <span>Type: {document.type.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New File</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  isActive
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "summary" && (
          <SummaryViewer
            summaries={analysis.summaries}
            activeLength={activeLength}
            onChangeLength={setActiveLength}
            onOpenExportModal={onOpenExportModal}
            documentTitle={document.name}
          />
        )}

        {activeTab === "key_points" && (
          <KeyPointsViewer
            entities={analysis.summaries[activeLength]?.entities || analysis.summaries.medium.entities}
          />
        )}

        {activeTab === "extracted_text" && (
          <ExtractedTextViewer
            data={analysis.extracted}
            documentTitle={document.name}
          />
        )}
      </div>

    </div>
  );
};
