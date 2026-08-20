import { ExtractedDocumentData, ExtractedPage } from "@/types";

export async function parsePdfFile(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  try {
    onProgress?.(10, "Loading PDF parsing engine...");
    
    // Dynamically import pdfjs-dist on client
    const pdfjsLib = await import("pdfjs-dist");
    
    if (typeof window !== "undefined") {
      // Set worker source to official cdn matching version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    let arrayBuffer: ArrayBuffer;
    if (fileOrBuffer instanceof File) {
      onProgress?.(20, `Reading "${fileOrBuffer.name}"...`);
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrBuffer;
    }

    onProgress?.(35, "Parsing PDF document structure...");
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const extractedPages: ExtractedPage[] = [];
    const allPageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const currentPercent = 35 + Math.floor((pageNum / numPages) * 55);
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
  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    throw new Error(`Failed to parse PDF document: ${error.message || error}`);
  }
}
