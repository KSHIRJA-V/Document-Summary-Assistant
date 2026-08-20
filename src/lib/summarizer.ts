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

export function splitSentences(text: string): string[] {
  if (!text) return [];
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/([.!?])\s*(?=[A-Z0-9])/g, "$1|SPLIT|")
    .replace(/\n\s*\n/g, "|SPLIT|")
    .replace(/\n[-*•]\s*/g, "|SPLIT|• ");

  return cleaned
    .split("|SPLIT|")
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((s) => s.length > 20 && /[a-zA-Z]/.test(s));
}

export function extractDocumentEntities(text: string): ExtractedEntities {
  const dateRegex = /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|Q[1-4]\s+\d{4}|Month\s+\d+|Phase\s+\d+|by\s+[A-Z][a-z]+\s+\d{1,2}(?:,\s+\d{4})?)\b/gi;
  const dates = Array.from(new Set((text.match(dateRegex) || []).map((s) => s.trim()))).slice(0, 8);

  const metricRegex = /\b(?:\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:M|B|k|million|billion|USD|thousands))?|\d+(?:\.\d+)?%|\d+(?:,\d{3})*\s*(?:TPS|ms|MB|GB|TB|units|hours|days|accounts|users|basis points|bps))\b/gi;
  const metrics = Array.from(new Set((text.match(metricRegex) || []).map((s) => s.trim()))).slice(0, 10);

  const sentences = splitSentences(text);
  const actionItems = sentences
    .filter((s) =>
      /\b(?:shall|must|will|agree|deliver|deploy|migrate|ensure|complete|implement|provide|trigger|schedule|projected)\b/i.test(s) &&
      !s.toLowerCase().startsWith("this document")
    )
    .slice(0, 6);

  const words = text
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

  const orgRegex = /\b(?:[A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Bank|Technologies|Services|Platform|Cloud|CDN|SaaS|Kubernetes|Kafka|PostgreSQL))\b)/g;
  const orgs = Array.from(new Set((text.match(orgRegex) || []).map((s) => s.trim()))).slice(0, 6);

  return {
    datesAndDeadlines: dates.length > 0 ? dates : ["Not explicitly specified"],
    metricsAndNumbers: metrics.length > 0 ? metrics : ["Key quantitative values identified"],
    keyTermsAndTopics: keyTerms,
    actionItems: actionItems.length > 0 ? actionItems : [sentences[0] || "Review document specifications"],
    organizationsAndNames: orgs.length > 0 ? orgs : ["Document Subject Entities"],
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

    if (/\$|\%|\b\d{4}\b|\bQ[1-4]\b|SLA|architecture|revenue|margin|phase|milestone|security/i.test(sentence)) {
      score *= 1.35;
    }

    if (sWords.length < 5) score *= 0.5;
    if (sWords.length > 50) score *= 0.8;

    return { sentence, score, index };
  });
}

function buildStructuredSections(text: string, count: number): SummarySection[] {
  const rawParagraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 40);
  const sections: SummarySection[] = [];

  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    const lines = p.split("\n").map((l) => l.trim()).filter(Boolean);
    let title = `Section ${i + 1}`;
    let contentLines: string[] = [];

    if (lines.length > 0) {
      const firstLine = lines[0];
      if (/^[\d.]+\s+[A-Z\s,:-]+/.test(firstLine) || (firstLine.length < 70 && !firstLine.endsWith("."))) {
        title = firstLine.replace(/^[\d.]+\s*/, "").trim();
        contentLines = lines.slice(1);
      } else {
        contentLines = lines;
      }
    }

    const content = contentLines.join(" ") || p;
    const sents = splitSentences(content);
    const bullets = sents.slice(0, 3);

    sections.push({
      title,
      content: sents.slice(0, 2).join(" ") || content,
      bullets: bullets.length > 1 ? bullets : undefined,
    });

    if (sections.length >= count) break;
  }

  if (sections.length === 0) {
    const allSents = splitSentences(text);
    sections.push({
      title: "Main Content",
      content: allSents.slice(0, 3).join(" "),
      bullets: allSents.slice(3, 7),
    });
  }

  return sections;
}

export function generateSmartSummary(
  text: string,
  length: SummaryLength = "medium"
): SummaryData {
  const sentences = splitSentences(text);
  const entities = extractDocumentEntities(text);
  const scored = scoreSentences(sentences, text);
  const sortedByScore = [...scored].sort((a, b) => b.score - a.score);

  const firstSentence = sentences[0] || "Document Summary";
  const headline = firstSentence.length < 120 ? firstSentence : firstSentence.slice(0, 117) + "...";

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

  const topSentences = sortedByScore
    .slice(0, targetSentencesCount)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence);

  const overview = topSentences.slice(0, length === "short" ? 2 : 3).join(" ");
  const keyTakeaways = topSentences.slice(length === "short" ? 1 : 2);

  if (keyTakeaways.length === 0 && sentences.length > 1) {
    keyTakeaways.push(...sentences.slice(1, 4));
  }

  const sections = buildStructuredSections(text, sectionCount);

  const totalWords = overview.split(/\s+/).length +
    keyTakeaways.reduce((acc, t) => acc + t.split(/\s+/).length, 0) +
    sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0);

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
