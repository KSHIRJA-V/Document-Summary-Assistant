import { NextRequest, NextResponse } from "next/server";
import { generateSmartSummary } from "@/lib/summarizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, length = "medium" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing document text." }, { status: 400 });
    }

    const summary = generateSmartSummary(text, length);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("API Summarize Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
