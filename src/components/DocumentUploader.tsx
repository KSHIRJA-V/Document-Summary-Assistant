"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileType, Image as ImageIcon, Sparkles, FileText, ArrowRight, Check, AlertCircle, FileCheck, Layers } from "lucide-react";
import { SAMPLE_DOCUMENTS } from "@/lib/sample-documents";
import { SampleDocPreset, UploadedDocument } from "@/types";

interface DocumentUploaderProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (sample: SampleDocPreset) => void;
  onRawTextSubmitted: (text: string, title: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileSelected,
  onSampleSelected,
  onRawTextSubmitted,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showTextTab, setShowTextTab] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp|tiff)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setErrorMsg("Please select a valid PDF or Image file (PDF, PNG, JPG, WEBP, BMP, TIFF).");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("File size exceeds 25 MB. Please upload a smaller document.");
      return;
    }

    onFileSelected(file);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) {
      setErrorMsg("Please paste or enter text to summarize.");
      return;
    }
    onRawTextSubmitted(customText.trim(), customTitle.trim() || "Pasted Document Snippet");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Upload Box Container */}
      <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-dark-card transition-all">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-unthinkable-border">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Upload Document</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#5dd667]/15 text-[#2d7534] dark:text-[#5dd667] border border-[#5dd667]/30">
                PDF & OCR Ready
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-unthinkable-textMuted mt-1">
              Drag & drop your files or test immediately with our preloaded enterprise presets.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-unthinkable-card p-1 rounded-xl border border-slate-200 dark:border-unthinkable-border self-start sm:self-auto">
            <button
              onClick={() => setShowTextTab(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !showTextTab
                  ? "bg-white dark:bg-[#11161f] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-unthinkable-border"
                  : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setShowTextTab(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                showTextTab
                  ? "bg-white dark:bg-[#11161f] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-unthinkable-border"
                  : "text-slate-600 dark:text-unthinkable-textMuted hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center space-x-3 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!showTextTab ? (
          /* Drag & Drop Zone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-6 border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-[#5dd667] bg-[#5dd667]/10 dark:bg-[#5dd667]/5 scale-[1.01]"
                : "border-slate-300 dark:border-unthinkable-border hover:border-[#5dd667]/70 dark:hover:border-[#5dd667]/60 bg-slate-50/50 dark:bg-unthinkable-card/40 hover:bg-slate-50 dark:hover:bg-unthinkable-card"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border flex items-center justify-center shadow-sm mb-4">
              <UploadCloud className="w-8 h-8 text-[#5dd667]" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
              Drop your PDF or Scanned Document here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-unthinkable-textMuted mt-1">
              or <span className="text-[#5dd667] font-semibold underline underline-offset-2">browse files</span> from your computer
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-unthinkable-textDim">
              <span className="flex items-center gap-1">
                <FileType className="w-3.5 h-3.5 text-red-400" /> PDF (.pdf)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Scanned Images (.png, .jpg, .webp)
              </span>
              <span>•</span>
              <span>Max 25 MB</span>
            </div>
          </div>
        ) : (
          /* Paste Raw Text */
          <form onSubmit={handlePasteSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Document Title / Context (Optional)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Quarterly Strategic Plan / Engineering RFC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Document Content / Text Snippet
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={7}
                placeholder="Paste the document text, report, or contract clauses here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-unthinkable-card border border-slate-200 dark:border-unthinkable-border text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5dd667] font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#5dd667] text-[#0b0f17] font-bold text-sm hover:bg-[#4ec257] shadow-emerald-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process & Summarize</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Preset Sample Documents for 1-Click Evaluation */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#5dd667]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Try Preloaded Sample Documents (1-Click Test)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-unthinkable-textMuted">
            Instant evaluation with zero uploads
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSampleSelected(sample)}
              className="group relative bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border hover:border-[#5dd667]/60 rounded-xl p-5 cursor-pointer shadow-sm hover:shadow-emerald-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-unthinkable-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-unthinkable-border">
                    {sample.category}
                  </span>

                  <span className="text-xs font-semibold text-slate-500 dark:text-unthinkable-textDim flex items-center gap-1">
                    {sample.fileType === "pdf" ? (
                      <FileType className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {sample.fileType.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#5dd667] transition-colors leading-snug">
                  {sample.title}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted mt-1 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-unthinkable-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-unthinkable-textDim">
                  {sample.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-unthinkable-card px-2 py-0.5 rounded text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="font-bold text-[#2d7534] dark:text-[#5dd667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Test Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
