"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { DocumentUploader } from "@/components/DocumentUploader";
import { ProcessingProgress } from "@/components/ProcessingProgress";
import { DocumentWorkbench } from "@/components/DocumentWorkbench";
import { ExportModal } from "@/components/ExportModal";
import { AssessmentWriteupModal } from "@/components/AssessmentWriteupModal";
import { SettingsModal } from "@/components/SettingsModal";
import {
  DocumentAnalysisResult,
  ProgressState,
  SampleDocPreset,
  UploadedDocument,
  UserAppSettings,
} from "@/types";
import { parsePdfFile } from "@/lib/pdf-parser";
import { performOcr } from "@/lib/ocr-engine";
import { generateAllSummaries } from "@/lib/summarizer";
import { calculateReadability, generateImprovementSuggestions } from "@/lib/document-analysis";

export default function HomePage() {
  const [settings, setSettings] = useState<UserAppSettings>({
    theme: "dark",
    aiProvider: "built-in",
    highlightKeywords: true,
    autoSpeakSummary: false,
  });

  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [progressState, setProgressState] = useState<ProgressState>({
    step: "idle",
    progress: 0,
    message: "",
  });

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync theme on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleUpdateSettings = (newSettings: Partial<UserAppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleReset = () => {
    setUploadedDoc(null);
    setAnalysisResult(null);
    setProgressState({ step: "idle", progress: 0, message: "" });
  };

  /**
   * Process a real uploaded File (PDF or Image)
   */
  const handleFileSelected = async (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const docId = `doc-${Date.now()}`;
    const previewUrl = !isPdf ? URL.createObjectURL(file) : undefined;

    const doc: UploadedDocument = {
      id: docId,
      name: file.name,
      size: file.size,
      type: isPdf ? "pdf" : "image",
      mimeType: file.type,
      file,
      previewUrl,
      uploadedAt: new Date(),
    };

    setUploadedDoc(doc);
    setProgressState({
      step: "uploading",
      progress: 10,
      message: `Ingesting "${file.name}"...`,
    });

    try {
      let extractedData;

      if (isPdf) {
        setProgressState({
          step: "extracting_pdf",
          progress: 25,
          message: "Parsing PDF text streams and layouts...",
        });

        extractedData = await parsePdfFile(file, (percent, msg) => {
          setProgressState({
            step: "extracting_pdf",
            progress: percent,
            message: msg,
          });
        });
      } else {
        setProgressState({
          step: "running_ocr",
          progress: 25,
          message: "Initializing Tesseract OCR neural worker...",
        });

        extractedData = await performOcr(file, (percent, msg) => {
          setProgressState({
            step: "running_ocr",
            progress: percent,
            message: msg,
          });
        });
      }

      // Check if text was extracted
      if (!extractedData.cleanText.trim()) {
        throw new Error("No readable text could be extracted from this document. If this is a scanned PDF, please upload it as an image for OCR.");
      }

      // Step 3: Summarization
      setProgressState({
        step: "generating_summary",
        progress: 80,
        message: "Scoring sentences & generating multi-tier summaries...",
      });

      const summaries = generateAllSummaries(extractedData.cleanText);

      // Step 4: Readability & Suggestions
      setProgressState({
        step: "analyzing_readability",
        progress: 92,
        message: "Computing readability metrics & improvement suggestions...",
      });

      const readability = calculateReadability(extractedData.cleanText);
      const suggestions = generateImprovementSuggestions(extractedData.cleanText, readability);

      const completeResult: DocumentAnalysisResult = {
        extracted: extractedData,
        summaries,
        readability,
        suggestions,
      };

      setProgressState({
        step: "ready",
        progress: 100,
        message: "Analysis ready!",
      });

      setAnalysisResult(completeResult);
    } catch (error: any) {
      console.error("Processing failed:", error);
      setProgressState({
        step: "error",
        progress: 0,
        message: error.message || "Failed to process document.",
        error: error.message,
      });
    }
  };

  /**
   * Process a 1-Click Sample Preset
   */
  const handleSampleSelected = async (sample: SampleDocPreset) => {
    const docId = `sample-${sample.id}`;
    const doc: UploadedDocument = {
      id: docId,
      name: sample.title,
      size: sample.sampleText.length * 2,
      type: sample.fileType,
      mimeType: sample.fileType === "pdf" ? "application/pdf" : "image/png",
      uploadedAt: new Date(),
    };

    setUploadedDoc(doc);
    setProgressState({
      step: "uploading",
      progress: 20,
      message: `Loading preset: ${sample.title}...`,
    });

    // Realistic step progression for smooth UX
    setTimeout(() => {
      setProgressState({
        step: sample.fileType === "pdf" ? "extracting_pdf" : "running_ocr",
        progress: 55,
        message: `Extracting ${sample.pages.length} pages & structuring text...`,
      });

      setTimeout(() => {
        setProgressState({
          step: "generating_summary",
          progress: 85,
          message: "Generating Short, Medium, and Long smart summaries...",
        });

        setTimeout(() => {
          const words = sample.sampleText.split(/\s+/).filter(Boolean);
          const extractedData = {
            rawText: sample.sampleText,
            cleanText: sample.sampleText,
            pages: sample.pages.map((p, idx) => ({
              pageNumber: idx + 1,
              text: p,
              confidence: 0.99,
            })),
            wordCount: words.length,
            charCount: sample.sampleText.length,
            paragraphCount: sample.pages.length,
            estimatedReadingMinutes: Math.max(1, Math.ceil(words.length / 200)),
            language: "en",
            confidence: 0.99,
          };

          const summaries = generateAllSummaries(sample.sampleText);
          const readability = calculateReadability(sample.sampleText);
          const suggestions = generateImprovementSuggestions(sample.sampleText, readability);

          setAnalysisResult({
            extracted: extractedData,
            summaries,
            readability,
            suggestions,
          });

          setProgressState({
            step: "ready",
            progress: 100,
            message: "Preset loaded!",
          });
        }, 400);
      }, 450);
    }, 400);
  };

  /**
   * Process pasted raw text snippet
   */
  const handleRawTextSubmitted = (text: string, title: string) => {
    const docId = `text-${Date.now()}`;
    const words = text.split(/\s+/).filter(Boolean);

    const doc: UploadedDocument = {
      id: docId,
      name: title,
      size: text.length,
      type: "pdf",
      mimeType: "text/plain",
      uploadedAt: new Date(),
    };

    setUploadedDoc(doc);
    setProgressState({
      step: "generating_summary",
      progress: 60,
      message: "Analyzing text snippet...",
    });

    setTimeout(() => {
      const extractedData = {
        rawText: text,
        cleanText: text,
        pages: [{ pageNumber: 1, text, confidence: 1.0 }],
        wordCount: words.length,
        charCount: text.length,
        paragraphCount: text.split(/\n\s*\n/).filter(Boolean).length || 1,
        estimatedReadingMinutes: Math.max(1, Math.ceil(words.length / 200)),
        language: "en",
        confidence: 1.0,
      };

      const summaries = generateAllSummaries(text);
      const readability = calculateReadability(text);
      const suggestions = generateImprovementSuggestions(text, readability);

      setAnalysisResult({
        extracted: extractedData,
        summaries,
        readability,
        suggestions,
      });

      setProgressState({
        step: "ready",
        progress: 100,
        message: "Analysis ready!",
      });
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReset={handleReset}
          hasDocument={!!uploadedDoc && progressState.step === "ready"}
        />

        {/* Hero Banner (Shown when no document is active) */}
        {!uploadedDoc && <HeroBanner />}

        {/* Main Content Area */}
        <main className="flex-1">
          {!uploadedDoc && (
            <DocumentUploader
              onFileSelected={handleFileSelected}
              onSampleSelected={handleSampleSelected}
              onRawTextSubmitted={handleRawTextSubmitted}
            />
          )}

          {uploadedDoc && progressState.step !== "ready" && (
            <ProcessingProgress
              progressState={progressState}
              fileName={uploadedDoc.name}
              onCancel={handleReset}
            />
          )}

          {uploadedDoc && analysisResult && progressState.step === "ready" && (
            <DocumentWorkbench
              document={uploadedDoc}
              analysis={analysisResult}
              settings={settings}
              onReset={handleReset}
              onOpenExportModal={() => setIsExportOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Unthinkable Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-unthinkable-border bg-white dark:bg-[#070a0f] py-8 text-xs text-slate-500 dark:text-unthinkable-textMuted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800 dark:text-white">
              unthinkable<span className="text-[#5dd667]">.</span>
            </span>
            <span>© 2026 Technical Assessment Project — Document Summary Assistant</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Assessment Write-Up
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Settings
            </button>
            <span>•</span>
            <a
              href="https://www.unthinkable.co/career/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2d7534] dark:text-[#5dd667] font-semibold hover:underline"
            >
              Unthinkable Careers
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        documentTitle={uploadedDoc?.name || "Document"}
        analysis={analysisResult!}
        activeLength="medium"
      />

      <AssessmentWriteupModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
      />

    </div>
  );
}
