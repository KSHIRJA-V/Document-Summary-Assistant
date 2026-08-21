import { ExtractedDocumentData } from "@/types";

/**
 * Optimizes and resizes image on HTML5 Canvas to achieve optimal OCR speed and clarity.
 * Downscales oversized images (which dramatically reduces OCR processing time).
 */
export async function optimizeImageForOcr(imageFile: File): Promise<Blob> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(imageFile);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(imageFile);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(imageFile);
          return;
        }

        // Optimal OCR dimension: max 1600px width/height
        const maxDim = 1600;
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

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob || imageFile);
          },
          "image/jpeg",
          0.85
        );
      } catch (err) {
        resolve(imageFile);
      }
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * Optical Character Recognition (OCR) Engine with fast server execution and progress simulation.
 */
export async function performOcr(
  imageFile: File,
  onProgress?: (percent: number, message: string) => void
): Promise<ExtractedDocumentData> {
  onProgress?.(15, "Optimizing image resolution for fast OCR...");

  let optimizedBlob: Blob;
  try {
    optimizedBlob = await optimizeImageForOcr(imageFile);
  } catch (optErr) {
    optimizedBlob = imageFile;
  }

  onProgress?.(30, "Scanning image with OCR engine...");

  // Progress simulation ticker to provide live visual feedback
  let currentPct = 30;
  const progressInterval = setInterval(() => {
    if (currentPct < 85) {
      currentPct += Math.floor(Math.random() * 8) + 4;
      onProgress?.(
        Math.min(85, currentPct),
        "Recognizing text characters and line structures..."
      );
    }
  }, 400);

  try {
    const formData = new FormData();
    formData.append("file", optimizedBlob, imageFile.name || "image.jpg");

    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    clearInterval(progressInterval);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server OCR returned status ${res.status}`);
    }

    onProgress?.(92, "Structuring extracted text...");
    const data: ExtractedDocumentData = await res.json();
    onProgress?.(100, "OCR text extraction complete!");
    return data;
  } catch (error: any) {
    clearInterval(progressInterval);
    console.error("OCR Error:", error);
    throw new Error(`OCR processing failed: ${error.message || error}`);
  }
}
