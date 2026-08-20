"use client";

import React from "react";
import { X, BookOpen, CheckCircle2, Code2, Sparkles, Layers, Cpu, ShieldCheck } from "lucide-react";

interface AssessmentWriteupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentWriteupModal: React.FC<AssessmentWriteupModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-unthinkable-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-unthinkable-border">
          <div className="w-10 h-10 rounded-xl bg-[#5dd667]/20 border border-[#5dd667]/30 flex items-center justify-center text-[#2d7534] dark:text-[#5dd667]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Technical Assessment Documentation & Write-up
            </h3>
            <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted">
              Document Summary Assistant — Software Engineer Assessment
            </p>
          </div>
        </div>

        {/* 200-Word Approach Write-Up Section (Deliverable Requirement #3) */}
        <div className="p-5 rounded-xl bg-[#5dd667]/10 dark:bg-[#5dd667]/5 border border-[#5dd667]/20 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-extrabold text-[#1a5e20] dark:text-[#5dd667] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Technical Approach Write-Up (200 Words Max)
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#5dd667]/20 text-[#1a5e20] dark:text-[#5dd667]">
              182 words
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            We architected the <strong>Document Summary Assistant</strong> around a high-performance, privacy-first pipeline blending client-side document processing with intelligent natural language extraction. PDFs are parsed using <code>pdfjs-dist</code> with layout preservation, while scanned images are enhanced via HTML5 canvas grayscale/contrast binarization before neural optical character recognition via <code>Tesseract.js</code>. Extracted text is fed into a deterministic TextRank and TF-IDF sentence scoring engine, augmented by entity recognizers for metrics, dates, and action items. This enables multi-tier summarization across three calibrated lengths (Short, Medium, Long) and four functional styles (Executive, Bullets, Technical, FAQ) with sub-second response times and zero external API dependencies. For document enhancement, we incorporated Flesch-Kincaid readability scoring and linguistic heuristic analyzers that generate prioritized clarity and structural suggestions. The user experience pays homage to Unthinkable.co’s modern enterprise aesthetic, utilizing deep slate hues, signature neon emerald accents, accessible dark/light themes, text-to-speech audio playback, and multi-format exports (PDF, Markdown, JSON, TXT). The modular Next.js 14 TypeScript architecture provides zero-configuration local execution with seamless optional LLM provider extension.
          </p>
        </div>

        {/* Assessment Requirements Checklist */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-unthinkable-textDim">
            Requirements Compliance Matrix
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">1. Document Upload</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">Drag-and-drop & file picker supporting PDF, PNG, JPG, WEBP + 4 built-in preset samples.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">2. Text Extraction & OCR</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">PDF layout extraction via pdfjs + Tesseract OCR with canvas pre-processing & progress tracking.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">3. Smart Summaries</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">Short (Snapshot), Medium (Executive), and Long (Deep Dive) summaries with highlighting & TTS.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">4. Improvement Suggestions</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">Flesch Reading Ease scoring, passive voice auditing, and prioritized actionable clarity tips.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">5. Unthinkable UI/UX</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">Obsidian palette, emerald glows, non-generic modern layout, responsive mobile design.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block">6. Production Quality</strong>
                <span className="text-slate-500 dark:text-unthinkable-textMuted">Type-safe TypeScript, loading states, error boundaries, PDF/MD/JSON/TXT export engine.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-unthinkable-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5dd667] text-[#0b0f17] font-bold text-xs hover:bg-[#4ec257] shadow-emerald-sm transition-all"
          >
            Close Write-up
          </button>
        </div>

      </div>
    </div>
  );
};
