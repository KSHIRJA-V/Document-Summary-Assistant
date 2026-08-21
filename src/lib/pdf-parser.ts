import { ExtractedDocumentData, ExtractedPage } from "@/types";

/**
 * Loads PDF.js script dynamically from CDN to prevent Webpack bundling chunk failures.
 */
function loadPdfJsCdn(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjs);
      } else {
        reject(new Error("pdfjsLib not found on window"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
    document.head.appendChild(script);
  });
}

/**
 * Parses PDF document using Server Route (/api/parse-pdf) with Client CDN fallback.
 */
export async function parsePdfFile(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  // Strategy 1: Server-side route (Fastest, zero chunk issues)
  if (fileOrBuffer instanceof File) {
    try {
      onProgress?.(20, `Reading "${fileOrBuffer.name}"...`);
      const formData = new FormData();
      formData.append("file", fileOrBuffer);

      onProgress?.(45, "Parsing PDF text structure...");
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onProgress?.(85, "Formatting extracted text...");
        const data: ExtractedDocumentData = await res.json();
        onProgress?.(100, "PDF parsing complete!");
        return data;
      }
    } catch (serverErr) {
      console.warn("Server PDF parse fallback to client CDN:", serverErr);
    }
  }

  // Strategy 2: Client-side CDN script loader
  try {
    onProgress?.(25, "Loading PDF parsing engine...");
    const pdfjs = await loadPdfJsCdn();

    let arrayBuffer: ArrayBuffer;
    if (fileOrBuffer instanceof File) {
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrBuffer;
    }

    onProgress?.(40, "Extracting PDF pages...");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const extractedPages: ExtractedPage[] = [];
    const allPageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const currentPercent = 40 + Math.floor((pageNum / numPages) * 50);
      onProgress?.(currentPercent, `Extracting page ${pageNum} of ${numPages}...`);

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageText = "";

      for (const item of textContent.items as any[]) {
        if ("str" in item) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
            pageText += "\n";
          } else if (pageText.length > 0 && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
            pageText += " ";
          }
          pageText += item.str;
          lastY = item.transform[5];
        }
      }

      const cleanPageText = pageText.replace(/\s+/g, " ").trim();
      extractedPages.push({
        pageNumber: pageNum,
        text: pageText.trim() || cleanPageText,
        confidence: 0.98,
      });
      allPageTexts.push(pageText.trim());
    }

    onProgress?.(95, "Formatting extracted text...");
    const rawText = allPageTexts.join("\n\n--- Page Break ---\n\n");
    const cleanText = allPageTexts.join("\n\n");

    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = cleanText.length;
    const paragraphCount = cleanText.split(/\n\s*\n/).filter(Boolean).length || 1;
    const estimatedReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    onProgress?.(100, "PDF extraction complete!");

    return {
      rawText,
      cleanText,
      pages: extractedPages,
      wordCount,
      charCount,
      paragraphCount,
      estimatedReadingMinutes,
      language: "en",
      confidence: 0.98,
    };
  } catch (clientErr: any) {
    console.error("PDF extraction error:", clientErr);
    throw new Error(`Failed to parse PDF: ${clientErr.message || clientErr}`);
  }
}
