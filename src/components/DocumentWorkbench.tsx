"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  CheckSquare,
  FileCode,
  Download,
  RefreshCw,
  History,
  FileType,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";
import {
  DocumentAnalysisResult,
  SessionDocumentItem,
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
  sessionHistory?: SessionDocumentItem[];
  onSelectSessionDoc?: (item: SessionDocumentItem) => void;
}

type WorkbenchTab = "summary" | "key_points" | "extracted_text";

export const DocumentWorkbench: React.FC<DocumentWorkbenchProps> = ({
  document,
  analysis,
  onReset,
  onOpenExportModal,
  sessionHistory = [],
  onSelectSessionDoc,
}) => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("summary");
  const [activeLength, setActiveLength] = useState<SummaryLength>("medium");
  const [showDocSwitcher, setShowDocSwitcher] = useState(false);

  const tabs: Array<{ id: WorkbenchTab; label: string; icon: any }> = [
    { id: "summary", label: "Smart Summary", icon: Sparkles },
    { id: "key_points", label: "Key Points", icon: CheckSquare },
    { id: "extracted_text", label: "Extracted Text", icon: FileCode },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      
      {/* Document Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-xl">
              {document.name}
            </h2>

            {/* Session Switcher dropdown button if > 1 doc */}
            {sessionHistory.length > 1 && (
              <div className="relative inline-block">
                <button
                  onClick={() => setShowDocSwitcher(!showDocSwitcher)}
                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Switch to another session document"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showDocSwitcher && (
                  <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 z-40">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Session Document
                    </div>
                    {sessionHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectSessionDoc?.(item);
                          setShowDocSwitcher(false);
                        }}
                        className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-between ${
                          item.id === document.id
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="truncate pr-2">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
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
