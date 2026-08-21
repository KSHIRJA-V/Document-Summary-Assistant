import { NextRequest, NextResponse } from "next/server";
import { generateAiSummary, generateAllAiSummaries } from "@/lib/ai-summarizer";
import { generateSmartSummary } from "@/lib/summarizer";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      length = "medium",
      all = false,
      provider = "gemini",
      apiKey,
    } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing document text." }, { status: 400 });
    }

    if (all) {
      const summaries = await generateAllAiSummaries(text, provider, apiKey);
      return NextResponse.json({ summaries });
    }

    const summary = await generateAiSummary(text, length, provider, apiKey);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("API Summarize Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
