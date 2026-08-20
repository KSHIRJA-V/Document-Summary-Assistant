# Document Summary Assistant

An enterprise-grade document intelligence and summarization web application inspired by the modern design aesthetic of [Unthinkable Solutions](https://www.unthinkable.co/career/). 

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **pdfjs-dist**, **Tesseract.js OCR**, and deterministic NLP algorithms.

---

## 📋 Technical Approach & Architecture (Assessment Write-Up)

> **Approach Write-Up (182 Words):**
> We architected the **Document Summary Assistant** around a high-performance, privacy-first pipeline blending client-side document processing with intelligent natural language extraction. PDFs are parsed using `pdfjs-dist` with layout preservation, while scanned images are enhanced via HTML5 canvas grayscale/contrast binarization before neural optical character recognition via `Tesseract.js`. Extracted text is fed into a deterministic TextRank and TF-IDF sentence scoring engine, augmented by entity recognizers for metrics, dates, and action items. This enables multi-tier summarization across three calibrated lengths (Short, Medium, Long) and four functional styles (Executive, Bullets, Technical, FAQ) with sub-second response times and zero external API dependencies. For document enhancement, we incorporated Flesch-Kincaid readability scoring and linguistic heuristic analyzers that generate prioritized clarity and structural suggestions. The user experience pays homage to Unthinkable.co’s modern enterprise aesthetic, utilizing deep slate hues, signature neon emerald accents, accessible dark/light themes, text-to-speech audio playback, and multi-format exports (PDF, Markdown, JSON, TXT). The modular Next.js 14 TypeScript architecture provides zero-configuration local execution with seamless optional LLM provider extension.

---

## 🌟 Key Features

### 1. Document Upload & Visual Inspection
- **Format Support**: Upload PDF documents (`.pdf`) and image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.tiff`).
- **Drag-and-Drop Dropzone**: Interactive dropzone with visual glowing feedback and file picker fallback.
- **Preloaded Sample Presets**: 4 built-in realistic documents (Engineering RFC, Master Services Agreement, Q3 Financial Earnings, Scanned Logistics Invoice) for instant 1-click evaluation without requiring local files.
- **Document Visualizer**: Image zoom (50% to 300%), 90-degree canvas rotation, and document inspection.

### 2. High-Fidelity Text Extraction & OCR
- **PDF Stream Extraction**: Page-by-page extraction preserving header boundaries, paragraph spacing, and line breaks.
- **Client-Side Neural OCR**: Powered by `Tesseract.js` with real-time progress indicators (0-100%).
- **Canvas Image Pre-processing**: Grayscale filtering and contrast thresholding to boost OCR accuracy on low-contrast scans.
- **Extracted Text Inspector**: Real-time keyword search, match highlighting, page-by-page filtering, word/char counts, and `.txt` export.

### 3. Smart Multi-Tier Summaries
- **3 Summary Lengths**:
  - **Short (Executive Snapshot)**: 30-second read, core headline, 3-4 bullet TL;DR.
  - **Medium (Balanced Overview)**: Thematic sections, core takeaways, entity highlights.
  - **Long (Deep Comprehensive Analysis)**: In-depth section breakdown, risk analysis, and FAQ generation.
- **4 Presentation Styles**: Executive Memo, Action Bullets Checklist, Technical Breakdown, and Q&A FAQ.
- **Linguistic Highlights**: Interactive toggle highlighting currencies, dates, deadlines, and action verbs in signature emerald green.
- **Text-to-Speech (TTS)**: Built-in voice synthesizer for hands-free summary playback.

### 4. Improvement Suggestions & Readability Center
- **Flesch Reading Ease**: Quantitative 0-100 score gauge with reader complexity classification.
- **Flesch-Kincaid Grade Level**: US school grade comprehension scale (e.g. 8th Grade Conversational vs College Technical).
- **Tone & Style Auditing**: Automatic sentiment detection (Professional, Urgent, Analytical) and passive voice percentage calculation.
- **Actionable Recommendations**: Prioritized suggestion cards (Clarity, Structure, Conciseness, Grammar & Tone, Actionability) with concrete recommendations and projected impact.

### 5. Conversational Document Q&A
- Interactive conversational chat grounded strictly on the uploaded document text.
- One-click suggested question chips (e.g. *"What are the main risks?"*, *"Summarize key dates"*).
- Optional BYOK (Bring Your Own Key) support for Google Gemini, OpenAI, or Groq via the Settings menu.

### 6. Multi-Format Export Engine
- **Branded Executive PDF**: Auto-formatted A4 PDF document with Unthinkable branding and headers.
- **Markdown (.md)**: GitHub-flavored markdown with checkboxes and entity blocks.
- **JSON (.json)**: Complete analysis payload including word counts, readability metrics, and suggestions.
- **Plain Text (.txt)**: Clean memo format for quick email distribution.

---

## 🎨 Design System (Unthinkable.co Homage)

The user interface is modeled after the sleek corporate branding of **Unthinkable Solutions**:
- **Palette**: Deep Obsidian (`#0b0f17`), Dark Card (`#11161f`), Signature Neon Emerald (`#5dd667`), Slate Borders (`#243242`).
- **Modern Typography**: Inter and Plus Jakarta Sans for crisp readability.
- **Theme Switching**: Dark Mode and Clean Light Slate Mode with seamless state transitions.
- **Zero Cookie-Cutter AI Template Feel**: Bespoke layout, custom status badges, responsive mobile drawer navigation, and micro-interactions.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, Server Actions & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF Engine**: [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **OCR Engine**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18.x or 20.x or 22.x
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd "C:\2-Kshirja\GitHub\Document Scanner"

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the application.

### Production Build
```bash
npm run build
npm run start
```

---

## ☁️ Deployment (Vercel / Netlify)

This Next.js application is 100% production ready and can be deployed instantly:

### Deploying to Vercel:
1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework preset will automatically detect **Next.js**.
4. Click **Deploy**.

---

## 📄 License
MIT License. Developed for the Software Engineer Assessment.
