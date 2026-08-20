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
  | "analyzing_readability"
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
export type SummaryFormat = "executive" | "bullets" | "technical" | "faq";

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
  format: SummaryFormat;
  headline: string;
  overview: string;
  keyTakeaways: string[];
  sections: SummarySection[];
  entities: ExtractedEntities;
  faqItems?: Array<{ question: string; answer: string }>;
  wordCount: number;
  generatedAt: string;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number; // 0 - 100
  fleschKincaidGrade: number; // e.g. 8.4
  readingGradeLabel: string; // e.g. "8th Grade (Conversational)"
  complexityBadge: "Easy" | "Moderate" | "Advanced" | "Complex";
  avgSentenceLengthWords: number;
  avgSyllablesPerWord: number;
  passiveVoicePercentage: number;
  sentimentTone: "Professional & Objective" | "Urgent & Direct" | "Academic & Analytical" | "Casual & Friendly";
  sentimentScore: number; // -1 to 1
}

export interface ImprovementSuggestion {
  id: string;
  category: "clarity" | "structure" | "conciseness" | "grammar_tone" | "actionability";
  severity: "high" | "medium" | "low" | "success";
  title: string;
  description: string;
  recommendation: string;
  impact: string;
}

export interface DocumentAnalysisResult {
  extracted: ExtractedDocumentData;
  summaries: {
    short: SummaryData;
    medium: SummaryData;
    long: SummaryData;
  };
  readability: ReadabilityMetrics;
  suggestions: ImprovementSuggestion[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
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
  apiKey?: string;
  aiProvider: "gemini" | "groq" | "openai" | "built-in";
  highlightKeywords: boolean;
  autoSpeakSummary: boolean;
}
