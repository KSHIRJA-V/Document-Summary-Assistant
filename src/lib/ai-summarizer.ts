import { SummaryData, SummaryLength, AIModelProvider, ExtractedEntities } from "@/types";
import { generateSmartSummary } from "./summarizer";

export async function generateAiSummary(
  text: string,
  length: SummaryLength = "medium",
  provider: AIModelProvider = "gemini",
  apiKey?: string
): Promise<SummaryData> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

  if (!effectiveKey && provider !== "local") {
    // If no key provided, fallback to improved local NLP engine
    return generateSmartSummary(text, length);
  }

  try {
    if (provider === "gemini" && effectiveKey) {
      return await callGeminiApi(text, length, effectiveKey);
    } else if (provider === "openai" && effectiveKey) {
      return await callOpenAiApi(text, length, effectiveKey, "https://api.openai.com/v1", "gpt-4o-mini");
    } else if (provider === "groq" && effectiveKey) {
      return await callOpenAiApi(text, length, effectiveKey, "https://api.groq.com/openai/v1", "llama-3.3-70b-versatile");
    }
  } catch (err) {
    console.warn("AI Model call failed, falling back to local NLP engine:", err);
  }

  return generateSmartSummary(text, length);
}

async function callGeminiApi(text: string, length: SummaryLength, apiKey: string): Promise<SummaryData> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are an expert document analyst. Analyze the following document text (which may contain OCR scan noise, email artifacts, headers, or timestamps) and produce a high-quality, professional abstractive summary.

Document Text:
"""
${text.slice(0, 25000)}
"""

Target Summary Length: ${length.toUpperCase()} (Short: ~100 words, Medium: ~250 words, Long: ~500 words).

Instructions:
1. Ignore and discard all OCR scan noise (e.g. status bar symbols, battery icons, WiFi/time text, garbled punctuation).
2. Write a clear, informative headline (e.g. "Application Status: London Stock Exchange Group").
3. Write an eloquent, coherent overview paragraph explaining the true meaning and context of the document in natural language.
4. Provide 3-5 concise, high-value key points.
5. Provide 2-4 structured thematic sections with clear titles.
6. Extract real entity values for dates, metrics, key terms, action items, and organization names.

Return ONLY a valid JSON object matching this exact schema with no extra surrounding text or markdown formatting:
{
  "headline": "string",
  "overview": "string",
  "keyTakeaways": ["string"],
  "sections": [
    {
      "title": "string",
      "content": "string"
    }
  ],
  "entities": {
    "datesAndDeadlines": ["string"],
    "metricsAndNumbers": ["string"],
    "keyTermsAndTopics": ["string"],
    "actionItems": ["string"],
    "organizationsAndNames": ["string"]
  }
}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) throw new Error("Empty response from Gemini API");

  const parsed = JSON.parse(rawJson);
  const totalWords = (parsed.overview || "").split(/\s+/).length +
    (parsed.keyTakeaways || []).reduce((acc: number, t: string) => acc + t.split(/\s+/).length, 0);

  return {
    length,
    headline: parsed.headline || "Executive Document Summary",
    overview: parsed.overview || "Document summary processed successfully.",
    keyTakeaways: parsed.keyTakeaways || [],
    sections: parsed.sections || [],
    entities: {
      datesAndDeadlines: parsed.entities?.datesAndDeadlines?.length ? parsed.entities.datesAndDeadlines : ["Not explicitly specified"],
      metricsAndNumbers: parsed.entities?.metricsAndNumbers?.length ? parsed.entities.metricsAndNumbers : ["None detected"],
      keyTermsAndTopics: parsed.entities?.keyTermsAndTopics?.length ? parsed.entities.keyTermsAndTopics : ["Document Overview"],
      actionItems: parsed.entities?.actionItems?.length ? parsed.entities.actionItems : ["No action items identified"],
      organizationsAndNames: parsed.entities?.organizationsAndNames?.length ? parsed.entities.organizationsAndNames : ["Document Subject"],
    },
    wordCount: totalWords,
    generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

async function callOpenAiApi(
  text: string,
  length: SummaryLength,
  apiKey: string,
  baseUrl: string,
  model: string
): Promise<SummaryData> {
  const prompt = `Analyze this document and produce a clear, human-grade executive summary. Clean all OCR artifacts and status bar noise. Return ONLY JSON.

Document:
${text.slice(0, 25000)}

Target Length: ${length}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert document summarizer. Always respond in valid JSON with headline, overview, keyTakeaways, sections, entities.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);

  const totalWords = (parsed.overview || "").split(/\s+/).length;

  return {
    length,
    headline: parsed.headline || "Executive Summary",
    overview: parsed.overview || "Summary generated.",
    keyTakeaways: parsed.keyTakeaways || [],
    sections: parsed.sections || [],
    entities: {
      datesAndDeadlines: parsed.entities?.datesAndDeadlines || ["None"],
      metricsAndNumbers: parsed.entities?.metricsAndNumbers || ["None"],
      keyTermsAndTopics: parsed.entities?.keyTermsAndTopics || ["General"],
      actionItems: parsed.entities?.actionItems || ["None"],
      organizationsAndNames: parsed.entities?.organizationsAndNames || ["General"],
    },
    wordCount: totalWords,
    generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export async function generateAllAiSummaries(
  text: string,
  provider: AIModelProvider = "gemini",
  apiKey?: string
): Promise<{ short: SummaryData; medium: SummaryData; long: SummaryData }> {
  // If we have an AI provider and key, generate high-quality summary via AI
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      const [short, medium, long] = await Promise.all([
        generateAiSummary(text, "short", provider, apiKey),
        generateAiSummary(text, "medium", provider, apiKey),
        generateAiSummary(text, "long", provider, apiKey),
      ]);
      return { short, medium, long };
    } catch (e) {
      console.warn("Batch AI generation failed, using local NLP:", e);
    }
  }

  const medium = await generateAiSummary(text, "medium", provider, apiKey);
  const short = await generateAiSummary(text, "short", provider, apiKey);
  const long = await generateAiSummary(text, "long", provider, apiKey);

  return { short, medium, long };
}
