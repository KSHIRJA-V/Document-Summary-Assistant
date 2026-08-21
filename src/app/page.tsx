"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { DocumentUploader } from "@/components/DocumentUploader";
import { ProcessingProgress } from "@/components/ProcessingProgress";
import { DocumentWorkbench } from "@/components/DocumentWorkbench";
import { ExportModal } from "@/components/ExportModal";
import {
  DocumentAnalysisResult,
  ProgressState,
  SampleDocPreset,
  SessionDocumentItem,
  UploadedDocument,
  UserAppSettings,
} from "@/types";
import { parsePdfFile } from "@/lib/pdf-parser";
import { performOcr } from "@/lib/ocr-engine";
import { generateAllSummaries } from "@/lib/summarizer";

export default function HomePage() {
  const [settings, setSettings] = useState<UserAppSettings>({
    theme: "dark",
  });

  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionDocumentItem[]>([]);
  const [progressState, setProgressState] = useState<ProgressState>({
    step: "idle",
    progress: 0,
    message: "",
  });

  const [isExportOpen, setIsExportOpen] = useState(false);

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

  const handleSelectSessionDoc = (item: SessionDocumentItem) => {
    setUploadedDoc(item.document);
    setAnalysisResult(item.analysis);
    setProgressState({ step: "ready", progress: 100, message: "Ready!" });
  };

  const handleClearSessionHistory = () => {
    setSessionHistory([]);
  };

  const addToSessionHistory = (doc: UploadedDocument, analysis: DocumentAnalysisResult) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const historyItem: SessionDocumentItem = {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: doc.size,
      wordCount: analysis.extracted.wordCount,
      timestamp: timeStr,
      document: doc,
      analysis,
    };

    setSessionHistory((prev) => {
      // Remove previous duplicate if same name
      const filtered = prev.filter((item) => item.name !== doc.name && item.id !== doc.id);
      return [historyItem, ...filtered];
    });
  };

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
      progress: 15,
      message: `Reading "${file.name}"...`,
    });

    try {
      let extractedData;

      if (isPdf) {
        setProgressState({
          step: "extracting_pdf",
          progress: 35,
          message: "Parsing PDF text...",
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
          progress: 30,
          message: "Running OCR on image...",
        });

        extractedData = await performOcr(file, (percent, msg) => {
          setProgressState({
            step: "running_ocr",
            progress: percent,
            message: msg,
          });
        });
      }

      if (!extractedData.cleanText.trim()) {
        extractedData.cleanText = "No clear text was detected in this image. You can paste or type text directly using the Paste Text tab, or upload a higher-contrast scan.";
        extractedData.rawText = extractedData.cleanText;
      }

      setProgressState({
        step: "generating_summary",
        progress: 85,
        message: "Generating summary and extracting key points...",
      });

      const summaries = generateAllSummaries(extractedData.cleanText);

      const completeResult: DocumentAnalysisResult = {
        extracted: extractedData,
        summaries,
      };

      setProgressState({
        step: "ready",
        progress: 100,
        message: "Ready!",
      });

      setAnalysisResult(completeResult);
      addToSessionHistory(doc, completeResult);
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
      progress: 30,
      message: `Loading ${sample.title}...`,
    });

    setTimeout(() => {
      setProgressState({
        step: "generating_summary",
        progress: 75,
        message: "Generating smart summary...",
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

        const completeResult: DocumentAnalysisResult = {
          extracted: extractedData,
          summaries,
        };

        setAnalysisResult(completeResult);
        addToSessionHistory(doc, completeResult);

        setProgressState({
          step: "ready",
          progress: 100,
          message: "Ready!",
        });
      }, 350);
    }, 300);
  };

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
      message: "Analyzing text...",
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

      const completeResult: DocumentAnalysisResult = {
        extracted: extractedData,
        summaries,
      };

      setAnalysisResult(completeResult);
      addToSessionHistory(doc, completeResult);

      setProgressState({
        step: "ready",
        progress: 100,
        message: "Ready!",
      });
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <div>
        <Navbar
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onReset={handleReset}
          hasDocument={!!uploadedDoc && progressState.step === "ready"}
          sessionHistory={sessionHistory}
          currentDocId={uploadedDoc?.id}
          onSelectSessionDoc={handleSelectSessionDoc}
          onClearSessionHistory={handleClearSessionHistory}
        />

        {!uploadedDoc && <HeroBanner />}

        <main className="flex-1">
          {!uploadedDoc && (
            <DocumentUploader
              onFileSelected={handleFileSelected}
              onSampleSelected={handleSampleSelected}
              onRawTextSubmitted={handleRawTextSubmitted}
              sessionHistory={sessionHistory}
              onSelectSessionDoc={handleSelectSessionDoc}
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
              sessionHistory={sessionHistory}
              onSelectSessionDoc={handleSelectSessionDoc}
            />
          )}
        </main>
      </div>

      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span>Document Summary Assistant</span>
          <span>PDF Parsing • OCR • Smart Summaries</span>
        </div>
      </footer>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        documentTitle={uploadedDoc?.name || "Document"}
        analysis={analysisResult!}
        activeLength="medium"
      />

    </div>
  );
}
