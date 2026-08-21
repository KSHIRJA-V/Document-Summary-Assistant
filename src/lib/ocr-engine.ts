import { ExtractedDocumentData } from "@/types";

/**
 * Preprocesses an image using an HTML5 Canvas to enhance OCR accuracy.
 * Applies grayscale, contrast boost, and binarization thresholding.
 */
export async function preprocessImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(img.src);
        return;
      }

      // Upscale if small for better character definition
      const minDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width < minDim || height < minDim) {
        const scale = Math.max(minDim / width, minDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original
      ctx.drawImage(img, 0, 0, width, height);

      // Extract pixel buffer
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Grayscale & high-contrast threshold filter
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrast = 1.3;
        const adjusted = ((gray - 128) * contrast) + 128;
        const clamped = Math.min(255, Math.max(0, adjusted));

        data[i] = clamped;
        data[i + 1] = clamped;
        data[i + 2] = clamped;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * Loads Tesseract.js dynamically from CDN to prevent Webpack bundling chunk failures.
 */
function loadTesseractCdn(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    if ((window as any).Tesseract) {
      resolve((window as any).Tesseract);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => {
      const Tesseract = (window as any).Tesseract;
      if (Tesseract) {
        resolve(Tesseract);
      } else {
        reject(new Error("Tesseract not found on window"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Tesseract from CDN"));
    document.head.appendChild(script);
  });
}

/**
 * Optical Character Recognition (OCR) Engine with dual Server and CDN fallback.
 */
export async function performOcr(
  imageFile: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  // Strategy 1: Server-side OCR Route (Fastest, zero chunk issues)
  try {
    onProgress?.(15, "Uploading image to OCR processor...");
    const formData = new FormData();
    formData.append("file", imageFile);

    onProgress?.(40, "Recognizing text characters with OCR engine...");
    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      onProgress?.(85, "Formatting extracted text...");
      const data: ExtractedDocumentData = await res.json();
      onProgress?.(100, "OCR text extraction finished!");
      return data;
    }
  } catch (serverErr) {
    console.warn("Server OCR fallback to client CDN:", serverErr);
  }

  // Strategy 2: Client-side CDN script loader
  try {
    onProgress?.(20, "Loading OCR engine from CDN...");
    const Tesseract = await loadTesseractCdn();

    onProgress?.(35, "Optimizing image clarity and contrast filters...");
    const preprocessedDataUrl = await preprocessImage(imageFile);
    const sourceToRecognize = preprocessedDataUrl || imageFile;

    onProgress?.(50, "Scanning image for character recognition...");

    const result = await Tesseract.recognize(
      sourceToRecognize,
      "eng",
      {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            const pct = Math.min(95, Math.max(50, Math.floor(50 + (m.progress * 45))));
            const progressText = Math.floor(m.progress * 100);
            onProgress?.(pct, `Recognizing text characters (${progressText}%)...`);
          }
        },
      }
    );

    onProgress?.(95, "Cleaning and structuring extracted text...");

    const rawText = result.data.text || "";
    const cleanText = rawText
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim();

    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = cleanText.length;
    const paragraphCount = cleanText.split(/\n\s*\n/).filter(Boolean).length || 1;
    const estimatedReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const confidence = (result.data.confidence || 85) / 100;

    onProgress?.(100, "OCR text extraction finished!");

    return {
      rawText: rawText.trim(),
      cleanText,
      pages: [
        {
          pageNumber: 1,
          text: cleanText,
          confidence,
        },
      ],
      wordCount,
      charCount,
      paragraphCount,
      estimatedReadingMinutes,
      language: "en",
      confidence,
    };
  } catch (error: any) {
    console.error("OCR Extraction Error:", error);
    throw new Error(`OCR processing failed: ${error.message || error}`);
  }
}
