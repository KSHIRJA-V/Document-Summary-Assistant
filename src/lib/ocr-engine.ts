import { ExtractedDocumentData } from "@/types";

/**
 * Loads Tesseract.js standalone browser bundle from CDN.
 * This avoids Webpack chunk bundling issues and leverages browser-native image decoding.
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

    const existing = document.querySelector('script[src*="tesseract.min.js"]') as HTMLScriptElement;
    if (existing) {
      if ((window as any).Tesseract) {
        resolve((window as any).Tesseract);
        return;
      }
      existing.addEventListener("load", () => {
        if ((window as any).Tesseract) resolve((window as any).Tesseract);
        else reject(new Error("Tesseract not available on window"));
      });
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
        reject(new Error("Tesseract library failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load OCR script from CDN."));
    document.head.appendChild(script);
  });
}

/**
 * Loads an image file onto an HTML5 Canvas, normalizing dimensions and applying contrast filters.
 */
function prepareImageCanvas(imageFile: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(imageFile);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas 2D context"));
          return;
        }

        // Standardize dimensions for fast and accurate OCR
        const maxDim = 1800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw decoded image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Apply contrast & clarity enhancement for OCR
        try {
          const imgData = ctx.getImageData(0, 0, width, height);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            // Slight contrast boost
            const enhanced = Math.min(255, Math.max(0, ((gray - 128) * 1.25) + 128));
            d[i] = enhanced;
            d[i + 1] = enhanced;
            d[i + 2] = enhanced;
          }
          ctx.putImageData(imgData, 0, 0);
        } catch {
          // If pixel manipulation fails, fallback to standard canvas
        }

        resolve(canvas);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load and decode image in browser."));
    };

    img.src = objectUrl;
  });
}

/**
 * Optical Character Recognition (OCR) Engine.
 * Uses browser-native canvas decoding + Tesseract.js worker with live progress tracking.
 */
export async function performOcr(
  imageFile: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  try {
    onProgress?.(10, "Preparing image and initializing OCR engine...");
    
    // 1. Prepare decoded image canvas
    const canvas = await prepareImageCanvas(imageFile);

    // 2. Load Tesseract library
    onProgress?.(25, "Loading optical character recognition model...");
    const Tesseract = await loadTesseractCdn();

    onProgress?.(35, "Scanning image characters...");

    // 3. Run recognition on the canvas element
    const result = await Tesseract.recognize(
      canvas,
      "eng",
      {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            const pct = Math.min(95, Math.max(35, Math.floor(35 + (m.progress * 60))));
            const progressNum = Math.floor(m.progress * 100);
            onProgress?.(pct, `Recognizing text (${progressNum}%)...`);
          } else if (m.status === "loading tesseract core") {
            onProgress?.(18, "Loading OCR core engine...");
          } else if (m.status === "loading language traineddata") {
            onProgress?.(28, "Loading language models...");
          }
        },
      }
    );

    onProgress?.(96, "Cleaning and formatting extracted text...");

    const rawText = result?.data?.text || "";
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
    const confidence = (result?.data?.confidence || 85) / 100;

    onProgress?.(100, "OCR text extraction complete!");

    return {
      rawText: rawText.trim() || cleanText,
      cleanText: cleanText || "No text detected in image.",
      pages: [
        {
          pageNumber: 1,
          text: cleanText || "No text detected in image.",
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
    console.error("Client OCR failed, trying server fallback:", error);

    // Fallback: server /api/ocr route
    try {
      onProgress?.(50, "Processing via backup OCR endpoint...");
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data: ExtractedDocumentData = await res.json();
        onProgress?.(100, "OCR extraction complete!");
        return data;
      }
    } catch (serverErr) {
      console.error("Server fallback also failed:", serverErr);
    }

    throw new Error(`Failed to process image OCR: ${error.message || error}`);
  }
}
