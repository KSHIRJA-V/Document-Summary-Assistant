import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { ExtractedDocumentData } from "@/types";

// Singleton worker cache to avoid reloading WASM and language weights on every request
let globalWorker: any = null;
let workerInitPromise: Promise<any> | null = null;

async function getOcrWorker() {
  if (globalWorker) return globalWorker;

  if (!workerInitPromise) {
    workerInitPromise = (async () => {
      try {
        const worker = await createWorker("eng", 1, {
          cacheMethod: "readOnly",
          gzip: true,
        });
        globalWorker = worker;
        return worker;
      } catch (err) {
        workerInitPromise = null;
        throw err;
      }
    })();
  }

  return workerInitPromise;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use fast cached worker
    let result;
    try {
      const worker = await getOcrWorker();
      result = await worker.recognize(buffer);
    } catch (workerErr) {
      console.warn("Cached worker failed, using fallback recognize:", workerErr);
      const Tesseract = require("tesseract.js");
      result = await Tesseract.recognize(buffer, "eng");
    }

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

    const data: ExtractedDocumentData = {
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

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Server OCR Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image OCR." },
      { status: 500 }
    );
  }
}
