import { NextRequest, NextResponse } from "next/server";
import { generateSmartSummary } from "@/lib/summarizer";
import { calculateReadability, generateImprovementSuggestions } from "@/lib/document-analysis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, text, question, length = "medium", format = "executive", apiKey, provider = "built-in" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing document text." }, { status: 400 });
    }

    // 1. Q&A Mode
    if (action === "chat") {
      if (!question) {
        return NextResponse.json({ error: "Missing question." }, { status: 400 });
      }

      // If external Gemini API Key provided
      if (apiKey && (provider === "gemini" || apiKey.startsWith("AIza"))) {
        try {
          const prompt = `You are the Unthinkable Document Intelligence Assistant. Answer the user's question accurately and concisely based ONLY on the following context:\n\n=== DOCUMENT TEXT ===\n${text.slice(0, 20000)}\n\n=== QUESTION ===\n${question}`;
          
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({ reply });
            }
          }
        } catch (apiErr) {
          console.warn("External Gemini API call failed, falling back to local extractor:", apiErr);
        }
      }

      // Local heuristic document Q&A engine
      const sentences = text.split(/[.!?]\s+/).filter(Boolean);
      const qWords = question.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w: string) => w.length > 2);
      
      const scoredSentences = sentences.map((s) => {
        const sLower = s.toLowerCase();
        let matches = 0;
        for (const qw of qWords) {
          if (sLower.includes(qw)) matches++;
        }
        return { sentence: s, score: matches };
      });

      scoredSentences.sort((a, b) => b.score - a.score);
      const topMatches = scoredSentences.filter((s) => s.score > 0).slice(0, 3);

      let answer = "";
      if (topMatches.length > 0) {
        answer = `Based on the document:\n\n` + topMatches.map((m) => `• ${m.sentence.trim()}.`).join("\n\n");
      } else {
        answer = `I analyzed the document for "${question}". While an exact keyword phrase wasn't found, the primary topic covers ${sentences.slice(0, 2).join(". ")}.`;
      }

      return NextResponse.json({ reply: answer });
    }

    // 2. Full Summary & Analysis Mode
    const summary = generateSmartSummary(text, length, format);
    const readability = calculateReadability(text);
    const suggestions = generateImprovementSuggestions(text, readability);

    return NextResponse.json({
      summary,
      readability,
      suggestions,
    });
  } catch (error: any) {
    console.error("API Summarize Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
