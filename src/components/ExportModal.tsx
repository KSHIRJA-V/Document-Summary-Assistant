"use client";

import React, { useState } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import { DocumentAnalysisResult, SummaryLength } from "@/types";
import { copyToClipboard, downloadFile, exportToPdf, generateMarkdownExport } from "@/lib/export-utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  analysis: DocumentAnalysisResult;
  activeLength: SummaryLength;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  analysis,
  activeLength,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSummary = analysis.summaries[activeLength] || analysis.summaries.medium;

  const handleExportPdf = () => {
    exportToPdf(currentSummary, documentTitle);
    onClose();
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdownExport(currentSummary, documentTitle);
    const safeName = documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadFile(md, `${safeName}_summary.md`, "text/markdown;charset=utf-8");
    onClose();
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(
      {
        documentTitle,
        exportTimestamp: new Date().toISOString(),
        summary: currentSummary,
        extractedMetadata: {
          wordCount: analysis.extracted.wordCount,
          charCount: analysis.extracted.charCount,
          estimatedReadingMinutes: analysis.extracted.estimatedReadingMinutes,
        },
      },
      null,
      2
    );
    const safeName = documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadFile(jsonStr, `${safeName}_analysis.json`, "application/json;charset=utf-8");
    onClose();
  };

  const handleExportTxt = () => {
    const txt = `${documentTitle.toUpperCase()} - SUMMARY REPORT\n\nOVERVIEW:\n${currentSummary.overview}\n\nKEY POINTS:\n${currentSummary.keyTakeaways.map((t) => `• ${t}`).join("\n")}\n\nACTION ITEMS:\n${currentSummary.entities.actionItems.map((a) => `[ ] ${a}`).join("\n")}`;
    const safeName = documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadFile(txt, `${safeName}_summary.txt`);
    onClose();
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownExport(currentSummary, documentTitle);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied("md");
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Export Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a format to download
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          
          {/* PDF */}
          <div
            onClick={handleExportPdf}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                PDF Document (.pdf)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formatted document summary
              </p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </div>

          {/* Markdown */}
          <div
            onClick={handleExportMarkdown}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Markdown File (.md)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Structured markdown text
              </p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </div>

          {/* JSON */}
          <div
            onClick={handleExportJson}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                JSON File (.json)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Raw structured data
              </p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </div>

          {/* TXT */}
          <div
            onClick={handleExportTxt}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Plain Text (.txt)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simple text file
              </p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </div>

        </div>

        {/* Copy Markdown */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Quick action:
          </span>
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
          >
            {copied === "md" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === "md" ? "Copied!" : "Copy as Markdown"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
