import { ExtractedDocumentData } from "@/types";

/**
 * Converts a File to a Base64 data URL and scales down oversized images for rapid OCR.
 */
export async function fileToOptimizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          // If within bounds, return original dataUrl directly
          if (width <= maxDim && height <= maxDim) {
            resolve(dataUrl);
            return;
          }

          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Optical Character Recognition (OCR) Engine with progress reporting.
 */
export async function performOcr(
  imageFile: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  onProgress?.(15, "Optimizing image clarity for OCR...");

  const dataUrl = await fileToOptimizedDataUrl(imageFile);

  onProgress?.(30, "Scanning characters with neural OCR engine...");

  // Progress ticker for responsive UI
  let currentPct = 30;
  const ticker = setInterval(() => {
    if (currentPct < 85) {
      currentPct += Math.floor(Math.random() * 6) + 3;
      onProgress?.(
        Math.min(85, currentPct),
        "Recognizing text characters and document layout..."
      );
    }
  }, 300);

  try {
    let res = await fetch("/api/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: dataUrl }),
    });

    // If JSON fails, fallback to FormData
    if (!res.ok) {
      const formData = new FormData();
      formData.append("file", imageFile);
      res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
    }

    clearInterval(ticker);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server OCR returned status ${res.status}`);
    }

    onProgress?.(92, "Structuring extracted text and key points...");
    const data: ExtractedDocumentData = await res.json();
    onProgress?.(100, "OCR text extraction complete!");
    return data;
  } catch (error: any) {
    clearInterval(ticker);
    console.error("OCR Extraction Error:", error);
    throw new Error(`OCR processing failed: ${error.message || error}`);
  }
}
