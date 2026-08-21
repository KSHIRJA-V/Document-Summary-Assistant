import {
  ExtractedEntities,
  SummaryData,
  SummaryLength,
  SummarySection,
} from "@/types";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
  "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
  "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
  "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
  "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
  "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you",
  "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);

/**
 * Strips OCR noise, mobile status bar symbols, battery/wifi indicators, and garbled punctuation.
 */
export function sanitizeOcrText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    // Remove isolated single punctuation and symbol gibberish lines like "» @ 804M & © 5% ¥"
    .replace(/^[^\w\s]{2,}.*$/gm, "")
    .replace(/^[»«©®™§¶•*~¥€£$#@!^&()_+={}[\]|\\:;"'<>,.?/-]{3,}.*$/gm, "")
    // Remove phone battery / wifi headers (e.g. "804M & © 5% ¥", "4:44am", "LTE 100%")
    .replace(/\b\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)?\b/g, "")
    .replace(/\b\d{1,3}%\b(?:\s*[\u0080-\uFFFF])?/g, "")
    // Normalize dashes and underscores
    .replace(/[-_]{3,}/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

export function splitSentences(text: string): string[] {
  const sanitized = sanitizeOcrText(text);
  if (!sanitized) return [];

  const cleaned = sanitized
    .replace(/([.!?])\s*(?=[A-Z0-9])/g, "$1|SPLIT|")
    .replace(/\n\s*\n/g, "|SPLIT|")
    .replace(/\n[-*•]\s*/g, "|SPLIT|• ");

  let sents = cleaned
    .split("|SPLIT|")
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    // Filter out sentences that are mostly non-letters or too short or pure numbers/symbols
    .filter((s) => {
      if (s.length < 12) return false;
      const letterCount = (s.match(/[a-zA-Z]/g) || []).length;
      return letterCount >= 8 && letterCount / s.length > 0.45;
    });

  if (sents.length === 0) {
    sents = sanitized
      .split("\n")
      .map((l) => l.trim().replace(/^[-*•\d.)\s]+/, "").trim())
      .filter((l) => l.length > 5 && /[a-zA-Z]/.test(l));
  }

  return sents;
}

export function extractDocumentEntities(text: string): ExtractedEntities {
  const sanitized = sanitizeOcrText(text);

  const dateRegex = /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|Q[1-4]\s+\d{4}|Month\s+\d+|Phase\s+\d+|by\s+[A-Z][a-z]+\s+\d{1,2}(?:,\s+\d{4})?)\b/gi;
  const dates = Array.from(new Set((sanitized.match(dateRegex) || []).map((s) => s.trim()))).slice(0, 8);

  const metricRegex = /\b(?:\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:M|B|k|million|billion|USD|thousands))?|\d+(?:\.\d+)?%|\d+(?:,\d{3})*\s*(?:TPS|ms|MB|GB|TB|units|hours|days|accounts|users|basis points|bps))\b/gi;
  const metrics = Array.from(new Set((sanitized.match(metricRegex) || []).map((s) => s.trim()))).slice(0, 10);

  const sentences = splitSentences(sanitized);
  const actionItems = sentences
    .filter((s) =>
      /\b(?:shall|must|will|agree|deliver|deploy|migrate|ensure|complete|implement|provide|trigger|schedule|regret|inform|apply)\b/i.test(s) &&
      !s.toLowerCase().includes("intended recipient") &&
      !s.toLowerCase().includes("confidential")
    )
    .slice(0, 6);

  const words = sanitized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const keyTerms = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const orgRegex = /\b(?:London Stock Exchange Group|LSEG|Google|Amazon|Microsoft|Apple|Meta|[A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Bank|Technologies|Services|Platform|Group|Careers|University))\b)/g;
  const orgs = Array.from(new Set((sanitized.match(orgRegex) || []).map((s) => s.trim()))).slice(0, 6);

  return {
    datesAndDeadlines: dates.length > 0 ? dates : ["Not explicitly specified"],
    metricsAndNumbers: metrics.length > 0 ? metrics : ["Key metrics extracted"],
    keyTermsAndTopics: keyTerms.length > 0 ? keyTerms : ["Document Overview"],
    actionItems: actionItems.length > 0 ? actionItems : (sentences.length > 0 ? [sentences[0]] : ["Review document communication"]),
    organizationsAndNames: orgs.length > 0 ? orgs : ["Document Subject"],
  };
}

function scoreSentences(sentences: string[], text: string): Array<{ sentence: string; score: number; index: number }> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => !STOP_WORDS.has(w) && w.length > 2);
  const wordFreq: Record<string, number> = {};
  for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;

  const totalWords = words.length || 1;

  return sentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => !STOP_WORDS.has(w));
    let score = 0;

    for (const sw of sWords) {
      if (wordFreq[sw]) {
        score += (wordFreq[sw] / totalWords);
      }
    }

    if (index === 0) score *= 1.8;
    else if (index < 3) score *= 1.4;
    else if (index < 6) score *= 1.2;

    // Favor real informational content, disfavor legal disclaimers
    if (/\b(?:regret|inform|candidacy|role|position|application|overview|summary|progress|results|financial|status)\b/i.test(sentence)) {
      score *= 2.0;
    }
    if (/intended recipient|confidential|delete this message|disclaimer|copyright|unauthorized/i.test(sentence)) {
      score *= 0.2;
    }

    return { sentence, score, index };
  });
}

function buildStructuredSections(text: string, count: number): SummarySection[] {
  const sanitized = sanitizeOcrText(text);
  const rawParagraphs = sanitized.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 20);
  const sections: SummarySection[] = [];

  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    const lines = p.split("\n").map((l) => l.trim()).filter(Boolean);
    let title = `Overview ${i + 1}`;
    let contentLines: string[] = [];

    if (lines.length > 0) {
      const firstLine = lines[0];
      if (/^[\d.]+\s+[A-Z\s,:-]+/.test(firstLine) || (firstLine.length < 60 && !firstLine.endsWith("."))) {
        title = firstLine.replace(/^[\d.]+\s*/, "").trim();
        contentLines = lines.slice(1);
      } else {
        contentLines = lines;
      }
    }

    const content = contentLines.join(" ") || p;
    const sents = splitSentences(content);
    if (sents.length === 0) continue;

    sections.push({
      title,
      content: sents.slice(0, 2).join(" ") || content,
      bullets: sents.length > 2 ? sents.slice(2, 5) : undefined,
    });

    if (sections.length >= count) break;
  }

  if (sections.length === 0) {
    const allSents = splitSentences(sanitized);
    sections.push({
      title: "Key Details",
      content: allSents.slice(0, 3).join(" ") || sanitized.slice(0, 300),
      bullets: allSents.slice(3, 6).length > 0 ? allSents.slice(3, 6) : undefined,
    });
  }

  return sections;
}

export function generateSmartSummary(
  text: string,
  length: SummaryLength = "medium"
): SummaryData {
  const clean = sanitizeOcrText(text);
  const sentences = splitSentences(clean);
  const entities = extractDocumentEntities(clean);
  const scored = scoreSentences(sentences, clean);
  const sortedByScore = [...scored].sort((a, b) => b.score - a.score);

  // Generate a clean headline
  let headline = "Document Summary";
  const informativeSent = sentences.find((s) => !/^\d|intended recipient|confidential/i.test(s));
  if (informativeSent) {
    headline = informativeSent.length < 100 ? informativeSent : informativeSent.slice(0, 97) + "...";
  }

  let targetSentencesCount = 3;
  let sectionCount = 3;

  if (length === "short") {
    targetSentencesCount = 3;
    sectionCount = 2;
  } else if (length === "medium") {
    targetSentencesCount = 6;
    sectionCount = 4;
  } else if (length === "long") {
    targetSentencesCount = 10;
    sectionCount = 6;
  }

  let topSentences = sortedByScore
    .slice(0, targetSentencesCount)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);

  if (topSentences.length === 0) {
    topSentences = [clean || "Text extracted from document."];
  }

  const overview = topSentences.slice(0, length === "short" ? 2 : 3).join(" ") || clean;
  let keyTakeaways = topSentences.slice(length === "short" ? 1 : 2);

  if (keyTakeaways.length === 0) {
    keyTakeaways = sentences.length > 0 ? sentences.slice(0, 3) : [clean || "Summary extracted successfully."];
  }

  const sections = buildStructuredSections(clean, sectionCount);
  const totalWords = clean.split(/\s+/).filter(Boolean).length;

  return {
    length,
    headline,
    overview,
    keyTakeaways,
    sections,
    entities,
    wordCount: totalWords,
    generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function generateAllSummaries(text: string): {
  short: SummaryData;
  medium: SummaryData;
  long: SummaryData;
} {
  return {
    short: generateSmartSummary(text, "short"),
    medium: generateSmartSummary(text, "medium"),
    long: generateSmartSummary(text, "long"),
  };
}
