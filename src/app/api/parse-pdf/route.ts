import { NextRequest, NextResponse } from "next/server";
import { ExtractedDocumentData, ExtractedPage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // CommonJS require for pdf-parse
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);

    const rawText = data.text || "";
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

    const totalPages = data.numpages || 1;
    const pages: ExtractedPage[] = [];

    if (totalPages > 1 && cleanText.length > 0) {
      const approxCharsPerPage = Math.ceil(cleanText.length / totalPages);
      for (let i = 0; i < totalPages; i++) {
        const pageChunk = cleanText.slice(i * approxCharsPerPage, (i + 1) * approxCharsPerPage).trim();
        pages.push({
          pageNumber: i + 1,
          text: pageChunk,
          confidence: 0.98,
        });
      }
    } else {
      pages.push({
        pageNumber: 1,
        text: cleanText,
        confidence: 0.98,
      });
    }

    const result: ExtractedDocumentData = {
      rawText,
      cleanText,
      pages,
      wordCount,
      charCount,
      paragraphCount,
      estimatedReadingMinutes,
      language: "en",
      confidence: 0.98,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Server PDF Parsing Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse PDF document." },
      { status: 500 }
    );
  }
}
