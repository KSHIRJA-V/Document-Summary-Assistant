"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileType, Image as ImageIcon, ArrowRight, AlertCircle, Layers } from "lucide-react";
import { SAMPLE_DOCUMENTS } from "@/lib/sample-documents";
import { SampleDocPreset } from "@/types";

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
      setErrorMsg("Please enter text to summarize.");
      return;
    }
    onRawTextSubmitted(customText.trim(), customTitle.trim() || "Pasted Document");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Upload Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Document
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Upload a PDF or image file to extract text and generate a summary.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setShowTextTab(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                !showTextTab
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              File Upload
            </button>
            <button
              onClick={() => setShowTextTab(true)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                showTextTab
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center space-x-2 text-red-700 dark:text-red-300 text-xs">
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
            className={`mt-5 border-2 border-dashed rounded-lg p-8 sm:p-10 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,image/bmp,image/tiff"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="mx-auto w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm mb-3">
              <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">
              Choose a file or drag & drop it here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports PDF, PNG, JPG, WEBP, BMP, TIFF (Up to 25 MB)
            </p>
          </div>
        ) : (
          /* Paste Raw Text */
          <form onSubmit={handlePasteSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title (Optional)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Project Overview"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Content
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={6}
                placeholder="Paste the document text here..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-all"
              >
                Process & Summarize
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Preset Sample Documents */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Sample Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSampleSelected(sample)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-lg p-4 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {sample.category}
                  </span>

                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    {sample.fileType === "pdf" ? (
                      <FileType className="w-3 h-3 text-red-400" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-blue-400" />
                    )}
                    {sample.fileType.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {sample.title}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Load Sample <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
