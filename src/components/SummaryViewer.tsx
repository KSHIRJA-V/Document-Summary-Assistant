"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Highlighter,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { SummaryData, SummaryFormat, SummaryLength } from "@/types";
import { copyToClipboard } from "@/lib/export-utils";

interface SummaryViewerProps {
  summaries: {
    short: SummaryData;
    medium: SummaryData;
    long: SummaryData;
  };
  activeLength: SummaryLength;
  onChangeLength: (length: SummaryLength) => void;
  activeFormat: SummaryFormat;
  onChangeFormat: (format: SummaryFormat) => void;
  onOpenExportModal: () => void;
  documentTitle: string;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({
  summaries,
  activeLength,
  onChangeLength,
  activeFormat,
  onChangeFormat,
  onOpenExportModal,
  documentTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentSummary = summaries[activeLength] || summaries.medium;

  const handleCopy = async () => {
    const textToCopy = `${currentSummary.headline}\n\nOVERVIEW:\n${currentSummary.overview}\n\nKEY TAKEAWAYS:\n${currentSummary.keyTakeaways.map((t) => `• ${t}`).join("\n")}`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = `${currentSummary.headline}. Overview: ${currentSummary.overview}. Key points: ${currentSummary.keyTakeaways.join(". ")}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Highlight entities in sentences if toggled
  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords) return text;

    // Highlight currencies, percentages, dates, and keywords
    const regex = /(\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*[MBk])?|\b\d+(?:\.\d+)?%|\b(?:Q[1-4]\s+\d{4}|Month\s+\d+|Phase\s+\d+)\b)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className="bg-[#5dd667]/25 text-[#1a5e20] dark:text-[#5dd667] px-1 rounded font-semibold dark:bg-[#5dd667]/20"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar: Length Selector & Format */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border">
        
        {/* Length Selector */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-unthinkable-panel p-1 rounded-lg border border-slate-200 dark:border-unthinkable-border">
          <span className="text-xs font-bold text-slate-500 dark:text-unthinkable-textDim px-2 hidden sm:inline">
            Length:
          </span>
          <button
            onClick={() => onChangeLength("short")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeLength === "short"
                ? "bg-[#5dd667] text-[#0b0f17] shadow-emerald-sm"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Short (Snapshot)
          </button>
          <button
            onClick={() => onChangeLength("medium")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeLength === "medium"
                ? "bg-[#5dd667] text-[#0b0f17] shadow-emerald-sm"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Medium (Executive)
          </button>
          <button
            onClick={() => onChangeLength("long")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeLength === "long"
                ? "bg-[#5dd667] text-[#0b0f17] shadow-emerald-sm"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Long (Deep Analysis)
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-unthinkable-panel p-1 rounded-lg border border-slate-200 dark:border-unthinkable-border">
          <span className="text-xs font-bold text-slate-500 dark:text-unthinkable-textDim px-2 hidden sm:inline">
            Style:
          </span>
          <button
            onClick={() => onChangeFormat("executive")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeFormat === "executive"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => onChangeFormat("bullets")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeFormat === "bullets"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Action Bullets
          </button>
          <button
            onClick={() => onChangeFormat("technical")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeFormat === "technical"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Technical Breakdown
          </button>
          <button
            onClick={() => onChangeFormat("faq")}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeFormat === "faq"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Q&A / FAQ
          </button>
        </div>

        {/* Utility Tools: Highlight, Speech, Copy, Export */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHighlightKeywords(!highlightKeywords)}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              highlightKeywords
                ? "bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667] border-[#5dd667]/40"
                : "bg-white dark:bg-unthinkable-panel text-slate-600 dark:text-unthinkable-textMuted border-slate-200 dark:border-unthinkable-border"
            }`}
            title="Toggle Smart Key Term Highlighting"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden sm:inline">Highlight</span>
          </button>

          <button
            onClick={handleToggleSpeech}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              isSpeaking
                ? "bg-amber-500 text-white border-amber-600 animate-pulse"
                : "bg-white dark:bg-unthinkable-panel text-slate-600 dark:text-unthinkable-textMuted border-slate-200 dark:border-unthinkable-border hover:text-slate-900 dark:hover:text-white"
            }`}
            title={isSpeaking ? "Stop Speaking" : "Read Summary Aloud (TTS)"}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Listen"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3 py-2 rounded-lg bg-[#5dd667] text-[#0b0f17] font-bold text-xs flex items-center gap-1.5 shadow-emerald-sm hover:bg-[#4ec257] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Main Headline & Context Card */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-unthinkable-border text-xs text-slate-500 dark:text-unthinkable-textMuted">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#5dd667]" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{documentTitle}</span>
          </div>
          <div className="flex items-center space-x-3 font-mono">
            <span>~{currentSummary.wordCount} words</span>
            <span>•</span>
            <span>Generated {currentSummary.generatedAt}</span>
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-4 leading-snug">
          {currentSummary.headline}
        </h3>

        {/* Overview Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card/60 border border-slate-200 dark:border-unthinkable-border text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          {renderHighlightedText(currentSummary.overview)}
        </div>

        {/* Core Takeaways */}
        <div className="mt-6">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-unthinkable-textDim mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5dd667]" />
            Key Takeaways & Core Insights
          </h4>

          <ul className="space-y-3">
            {currentSummary.keyTakeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-unthinkable-card border border-slate-200/80 dark:border-unthinkable-border/80 hover:border-[#5dd667]/50 transition-colors text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-[#5dd667]/20 text-[#2d7534] dark:text-[#5dd667] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {idx + 1}
                </div>
                <div>{renderHighlightedText(takeaway)}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Thematic Sections */}
        {currentSummary.sections && currentSummary.sections.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-unthinkable-border">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-unthinkable-textDim mb-4 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#5dd667]" />
              Detailed Thematic Sections
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSummary.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-unthinkable-card/40 border border-slate-200 dark:border-unthinkable-border flex flex-col justify-between"
                >
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                      <ChevronRight className="w-4 h-4 text-[#5dd667]" />
                      {sec.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-unthinkable-textMuted leading-relaxed">
                      {renderHighlightedText(sec.content)}
                    </p>
                  </div>

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="mt-3 pt-3 border-t border-slate-200/60 dark:border-unthinkable-border/60 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-2">
                          <span className="text-[#5dd667] font-bold">•</span>
                          <span>{renderHighlightedText(b)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Items (if active) */}
        {currentSummary.faqItems && currentSummary.faqItems.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-unthinkable-border">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-unthinkable-textDim mb-4 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#5dd667]" />
              Extracted Questions & Answers (FAQ)
            </h4>

            <div className="space-y-3">
              {currentSummary.faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border"
                >
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                    <span className="text-[#5dd667] font-bold">Q:</span>
                    {faq.question}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-unthinkable-textMuted pl-5 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">A: </strong>
                    {renderHighlightedText(faq.answer)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
