# Document Summary Assistant
*Active Link*: https://document-summary-assist-a5a3opkkz-kshirja-vs-projects.vercel.app/

A document intelligence web application that extracts structured text from PDF files and scanned images using Optical Character Recognition (OCR), and generates executive summaries and actionable key points.

---

## Technical Approach Summary

The Document Summary Assistant is built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. The system processes documents through three core stages:

1. **Document Ingestion and Parsing**: Multi-page PDF documents are parsed through a dedicated server-side extraction pipeline that preserves paragraph breaks and layout structure. For scanned documents and image files, client-side HTML5 Canvas preprocessing handles resolution normalization and contrast adjustment before routing to Tesseract.js for Optical Character Recognition.
2. **Text Sanitization and Summarization**: Raw text passes through a domain sanitizer that removes OCR noise, status bar artifacts, email headers, citations, and table dumps. The summarizer generates multi-length summaries (Short, Medium, Long) with executive headlines, contextual overviews, and structured key takeaways.
3. **User Interface and Export**: A tabbed workbench provides length toggling, interactive action item tracking, in-memory session history, and multi-format exports (PDF, Markdown, JSON, Plain Text).

---

## Core Features

### 1. Document Upload
- Supports PDF files and standard image formats (.png, .jpg, .jpeg, .webp, .bmp, .tiff) up to 25 MB.
- Drag-and-drop file uploader and native file picker.
- Four pre-configured sample document presets for testing.
- Direct text paste input option.

### 2. Text Extraction
- Multi-page PDF text extraction with layout and paragraph preservation.
- Optical Character Recognition (OCR) for scanned images and screenshots via Tesseract.js.
- Extracted text inspector with search, keyword match highlighting, page filters, word counts, and .txt download.

### 3. Smart Summary
- Three selectable summary lengths:
  - Short: Core executive snapshot and essential points.
  - Medium: Balanced summary with context and structured sections.
  - Long: In-depth analysis with detailed breakdowns.
- One-click clipboard copy.

### 4. Key Points and Entities
- Interactive checklist for action items and deliverables.
- Extraction of dates, milestones, and deadlines.
- Extraction of quantitative metrics and financial figures.
- Extraction of domain terminology and named organizations.

### 5. Multi-Format Export
- Export summaries and extracted data to PDF, Markdown (.md), JSON (.json), and Plain Text (.txt).

---

## Technology Stack

- **Framework**: Next.js 14 (App Router, React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Extraction**: pdf-parse, pdfjs-dist
- **OCR Engine**: Tesseract.js
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Deployment**: Vercel
