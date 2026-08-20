"use client";

import React, { useState } from "react";
import { Search, Copy, Download, Check, FileText, Filter } from "lucide-react";
import { ExtractedDocumentData } from "@/types";
import { copyToClipboard, downloadFile } from "@/lib/export-utils";

interface ExtractedTextViewerProps {
  data: ExtractedDocumentData;
  documentTitle: string;
}

export const ExtractedTextViewer: React.FC<ExtractedTextViewerProps> = ({
  data,
  documentTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<number | "all">("all");
  const [copied, setCopied] = useState(false);

  const displayedText =
    selectedPage === "all"
      ? data.cleanText
      : data.pages.find((p) => p.pageNumber === selectedPage)?.text || data.cleanText;

  const handleCopy = async () => {
    const success = await copyToClipboard(displayedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const safeTitle = documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadFile(data.rawText, `${safeTitle}_extracted_text.txt`);
  };

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={idx}
          className="bg-amber-300 dark:bg-amber-500/40 text-slate-900 dark:text-amber-200 px-0.5 rounded font-bold"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
      
      {/* Controls & Search */}
      <div className="p-4 border-b border-slate-100 dark:border-unthinkable-border bg-slate-50/50 dark:bg-unthinkable-card/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within extracted text..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667]"
          />
        </div>

        {/* Page Filter & Actions */}
        <div className="flex items-center space-x-2">
          {data.pages.length > 1 && (
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Pages ({data.pages.length})</option>
              {data.pages.map((p) => (
                <option key={p.pageNumber} value={p.pageNumber}>
                  Page {p.pageNumber}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>
        </div>

      </div>

      {/* Stats Bar */}
      <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-unthinkable-card/60 border-b border-slate-200/60 dark:border-unthinkable-border/60 flex items-center justify-between text-xs text-slate-500 dark:text-unthinkable-textMuted font-mono">
        <div className="flex items-center space-x-4">
          <span>Words: {data.wordCount.toLocaleString()}</span>
          <span>•</span>
          <span>Chars: {data.charCount.toLocaleString()}</span>
          <span>•</span>
          <span>Est. Reading: ~{data.estimatedReadingMinutes} min</span>
        </div>
        <span className="text-[11px] font-bold text-[#5dd667]">
          Confidence: {Math.round((data.confidence || 0.95) * 100)}%
        </span>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text bg-white dark:bg-unthinkable-panel">
        {highlightMatches(displayedText, searchQuery)}
      </div>

    </div>
  );
};
