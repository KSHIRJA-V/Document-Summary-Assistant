export type DocumentType = "pdf" | "image";

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: DocumentType;
  mimeType: string;
  file?: File;
  previewUrl?: string;
  pageCount?: number;
  uploadedAt: Date;
}

export type ProcessingStep =
  | "idle"
  | "uploading"
  | "extracting_pdf"
  | "running_ocr"
  | "generating_summary"
  | "ready"
  | "error";

export interface ProgressState {
  step: ProcessingStep;
  progress: number; // 0 to 100
  message: string;
  error?: string;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  confidence?: number;
}

export interface ExtractedDocumentData {
  rawText: string;
  cleanText: string;
  pages: ExtractedPage[];
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  estimatedReadingMinutes: number;
  language: string;
  confidence: number;
}

export type SummaryLength = "short" | "medium" | "long";

export interface SummarySection {
  title: string;
  content: string;
  bullets?: string[];
}

export interface ExtractedEntities {
  datesAndDeadlines: string[];
  metricsAndNumbers: string[];
  keyTermsAndTopics: string[];
  actionItems: string[];
  organizationsAndNames: string[];
}

export interface SummaryData {
  length: SummaryLength;
  headline: string;
  overview: string;
  keyTakeaways: string[];
  sections: SummarySection[];
  entities: ExtractedEntities;
  wordCount: number;
  generatedAt: string;
}

export interface DocumentAnalysisResult {
  extracted: ExtractedDocumentData;
  summaries: {
    short: SummaryData;
    medium: SummaryData;
    long: SummaryData;
  };
}

export interface SessionDocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  wordCount: number;
  timestamp: string;
  document: UploadedDocument;
  analysis: DocumentAnalysisResult;
}

export interface SampleDocPreset {
  id: string;
  title: string;
  subtitle: string;
  category: "Business" | "Engineering" | "Finance" | "Operations";
  fileType: "pdf" | "image";
  description: string;
  sampleText: string;
  pages: string[];
  tags: string[];
}

export interface UserAppSettings {
  theme: "dark" | "light";
}
