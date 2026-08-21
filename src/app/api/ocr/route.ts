import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { ExtractedDocumentData } from "@/types";

export const maxDuration = 60; // Allow sufficient timeout for OCR

export async function POST(req: NextRequest) {
  let worker: any = null;
  try {
    let buffer: Buffer;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.image) {
        return NextResponse.json({ error: "Missing image data in request." }, { status: 400 });
      }
      const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No image file provided." }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    // Create fresh worker to prevent deadlock across requests
    worker = await createWorker("eng");
    const result = await worker.recognize(buffer);
    await worker.terminate();
    worker = null;

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

    const data: ExtractedDocumentData = {
      rawText: rawText.trim() || "No text detected in image.",
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

    return NextResponse.json(data);
  } catch (error: any) {
    if (worker) {
      try {
        await worker.terminate();
      } catch (tErr) {
        // ignore
      }
    }
    console.error("Server OCR Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image OCR." },
      { status: 500 }
    );
  }
}
