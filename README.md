# Document Summary Assistant

A clean and intuitive document intelligence application to upload PDF files and scanned images, extract text using Optical Character Recognition (OCR), and automatically generate smart summaries and key points.

---

## 🌟 Features

### 1. Document Upload
- Supports **PDF** files and **Image** files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.tiff`).
- Drag-and-drop or file picker interface for easy uploads (up to 25 MB).
- Includes 4 built-in sample documents for instant testing.
- Direct text paste option for quick snippet processing.

### 2. Text Extraction & OCR
- **PDF Parsing**: Extracts text from multi-page PDFs preserving paragraph layout and structure.
- **Optical Character Recognition (OCR)**: Uses `Tesseract.js` with canvas contrast pre-processing for scanned documents.
- **Extracted Text Inspector**: Real-time keyword search, match highlighting, page-by-page view, word count, character count, and `.txt` download.

### 3. Smart Summary
- **3 Summary Length Options**:
  - **Short**: Quick executive snapshot (core headline and key points).
  - **Medium**: Balanced summary with overview and thematic sections.
  - **Long**: Comprehensive analysis with detailed section breakdowns.
- One-click copy to clipboard.

### 4. Key Points Extraction
- **Action Items & Tasks**: Interactive checklist with actionable responsibilities.
- **Dates & Deadlines**: Extracted schedules and milestones.
- **Numbers & Metrics**: Key financial, operational, and numerical data.
- **Key Terms & Entities**: Important keywords and named organizations.

### 5. Export System
- Export summaries to **PDF**, **Markdown (.md)**, **JSON (.json)**, or **Plain Text (.txt)**.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Extraction**: `pdfjs-dist`
- **OCR Engine**: `Tesseract.js`
- **PDF Export**: `jsPDF`
- **Icons**: Lucide React

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js 18+ or 20+ or 22+
- npm

### Setup
```bash
# Navigate to the project directory
cd "C:\2-Kshirja\GitHub\Document Scanner"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
