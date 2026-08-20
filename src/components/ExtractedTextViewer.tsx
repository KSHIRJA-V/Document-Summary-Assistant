"use client";

import React, { useState } from "react";
import { Search, Copy, Download, Check } from "lucide-react";
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
          className="bg-amber-200 dark:bg-amber-500/40 text-slate-900 dark:text-amber-100 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
      
      {/* Controls & Search */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extracted text..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Page Filter & Actions */}
        <div className="flex items-center space-x-2">
          {data.pages.length > 1 && (
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
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
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>
        </div>

      </div>

      {/* Stats Bar */}
      <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-3">
          <span>Words: {data.wordCount.toLocaleString()}</span>
          <span>•</span>
          <span>Chars: {data.charCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text bg-white dark:bg-slate-900">
        {highlightMatches(displayedText, searchQuery)}
      </div>

    </div>
  );
};
