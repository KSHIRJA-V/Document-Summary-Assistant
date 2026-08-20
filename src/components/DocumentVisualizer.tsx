"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, FileText, Image as ImageIcon, Eye } from "lucide-react";
import { UploadedDocument } from "@/types";

interface DocumentVisualizerProps {
  document: UploadedDocument;
  rawText?: string;
}

export const DocumentVisualizer: React.FC<DocumentVisualizerProps> = ({
  document,
  rawText,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[650px]">
      
      {/* Visualizer Toolbar */}
      <div className="p-4 border-b border-slate-100 dark:border-unthinkable-border bg-slate-50/50 dark:bg-unthinkable-card/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {document.type === "pdf" ? (
            <FileText className="w-4 h-4 text-red-400" />
          ) : (
            <ImageIcon className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">
            {document.name}
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-unthinkable-card text-slate-700 dark:text-slate-300">
            {document.type.toUpperCase()}
          </span>
        </div>

        {document.previewUrl && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-unthinkable-border hover:bg-slate-100 dark:hover:bg-unthinkable-card text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1 font-semibold text-slate-600 dark:text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-unthinkable-border hover:bg-slate-100 dark:hover:bg-unthinkable-card text-slate-600 dark:text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-unthinkable-border hover:bg-slate-100 dark:hover:bg-unthinkable-card text-slate-600 dark:text-slate-300"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-unthinkable-border hover:bg-slate-100 dark:hover:bg-unthinkable-card text-slate-600 dark:text-slate-300"
              title="Reset View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Document View Canvas */}
      <div className="flex-1 p-6 overflow-auto bg-slate-100 dark:bg-[#070a0f] flex items-center justify-center relative">
        {document.previewUrl ? (
          <div
            className="transition-transform duration-200 flex items-center justify-center shadow-2xl rounded-lg overflow-hidden max-w-full max-h-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={document.previewUrl}
              alt={document.name}
              className="max-h-[500px] w-auto object-contain rounded bg-white shadow-md"
            />
          </div>
        ) : (
          <div className="text-center p-8 max-w-md bg-white dark:bg-unthinkable-panel border border-slate-200 dark:border-unthinkable-border rounded-2xl shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#5dd667]/20 flex items-center justify-center mb-3 text-[#2d7534] dark:text-[#5dd667]">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Parsed Text Document
            </h4>
            <p className="text-xs text-slate-500 dark:text-unthinkable-textMuted mt-1 leading-relaxed">
              This document was ingested and extracted via the high-throughput text pipeline. View structured results in the <strong className="text-[#5dd667]">Extracted Text</strong> or <strong className="text-[#5dd667]">Summary</strong> tabs.
            </p>
          </div>
        )}
      </div>

      {/* Metadata Bar */}
      <div className="p-3 bg-white dark:bg-unthinkable-panel border-t border-slate-200 dark:border-unthinkable-border flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-unthinkable-textMuted font-mono">
        <div>Size: {(document.size / 1024).toFixed(1)} KB</div>
        <div>MIME: {document.mimeType || "application/octet-stream"}</div>
        <div>Ingested: {new Date(document.uploadedAt).toLocaleTimeString()}</div>
      </div>

    </div>
  );
};
