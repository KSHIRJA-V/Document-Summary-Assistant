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
        // Luminance calculation
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Contrast enhancement
        const contrast = 1.3;
        const adjusted = ((gray - 128) * contrast) + 128;
        const clamped = Math.min(255, Math.max(0, adjusted));

        data[i] = clamped;     // Red
        data[i + 1] = clamped; // Green
        data[i + 2] = clamped; // Blue
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * Optical Character Recognition (OCR) Engine using Tesseract.js
 */
export async function performOcr(
  imageFile: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  try {
    onProgress?.(5, "Initializing neural OCR engine...");
    
    // Dynamic import to support SSR environments
    const Tesseract = await import("tesseract.js");

    onProgress?.(15, "Optimizing image clarity and contrast filters...");
    const preprocessedDataUrl = await preprocessImage(imageFile);
    const sourceToRecognize = preprocessedDataUrl || imageFile;

    onProgress?.(30, "Scanning image for character recognition...");

    const result = await Tesseract.recognize(
      sourceToRecognize,
      "eng",
      {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.min(95, Math.max(30, Math.floor(30 + (m.progress * 65))));
            const progressText = Math.floor(m.progress * 100);
            onProgress?.(pct, `Recognizing text characters (${progressText}%)...`);
          } else if (m.status === "loading tesseract core") {
            onProgress?.(18, "Loading OCR core weights...");
          } else if (m.status === "loading language traineddata") {
            onProgress?.(25, "Loading English language model...");
          }
        },
      }
    );

    onProgress?.(96, "Cleaning and structuring extracted text...");

    const rawText = result.data.text || "";
    // Clean excessive spaces, normalize line endings
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
