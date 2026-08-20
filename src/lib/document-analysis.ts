import { ImprovementSuggestion, ReadabilityMetrics } from "@/types";
import { splitSentences } from "./summarizer";

/**
 * Counts syllables in an English word using phonetic heuristics.
 */
function countSyllablesInWord(rawWord: string): number {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;

  const cleaned = word
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");

  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Computes Flesch Reading Ease, Flesch-Kincaid Grade Level, and tone metrics.
 */
export function calculateReadability(text: string): ReadabilityMetrics {
  const sentences = splitSentences(text);
  const totalSentences = Math.max(1, sentences.length);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const totalWords = Math.max(1, words.length);

  let totalSyllables = 0;
  let complexWordsCount = 0;

  for (const word of words) {
    const syllables = countSyllablesInWord(word);
    totalSyllables += syllables;
    if (syllables >= 3) complexWordsCount++;
  }

  const wordsPerSentence = totalWords / totalSentences;
  const syllablesPerWord = totalSyllables / totalWords;

  // Flesch Reading Ease: 206.835 - 1.015 * (words/sentence) - 84.6 * (syllables/word)
  let fleschReadingEase = Math.round(
    206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord)
  );
  fleschReadingEase = Math.max(0, Math.min(100, fleschReadingEase));

  // Flesch-Kincaid Grade Level: 0.39 * (words/sentence) + 11.8 * (syllables/word) - 15.59
  let fleschKincaidGrade = Number(
    ((0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59).toFixed(1)
  );
  fleschKincaidGrade = Math.max(1, Math.min(20, fleschKincaidGrade));

  let readingGradeLabel = "8th - 9th Grade (Standard Reader)";
  let complexityBadge: "Easy" | "Moderate" | "Advanced" | "Complex" = "Moderate";

  if (fleschReadingEase >= 80) {
    readingGradeLabel = "5th - 6th Grade (Very Easy / Accessible)";
    complexityBadge = "Easy";
  } else if (fleschReadingEase >= 60) {
    readingGradeLabel = "8th - 10th Grade (Conversational Business)";
    complexityBadge = "Moderate";
  } else if (fleschReadingEase >= 40) {
    readingGradeLabel = "College Level (Advanced Technical / Legal)";
    complexityBadge = "Advanced";
  } else {
    readingGradeLabel = "Postgraduate / Specialist Level (Highly Complex)";
    complexityBadge = "Complex";
  }

  // Detect passive voice constructions
  const passiveVoiceMatches = text.match(
    /\b(?:is|are|was|were|be|been|being)\s+(?:[a-z]+ed|[a-z]+en|built|made|sent|paid|given|shown|held|run|done)\b/gi
  ) || [];
  const passiveVoicePercentage = Math.min(
    100,
    Math.round((passiveVoiceMatches.length / totalSentences) * 100)
  );

  // Sentiment & tone analysis
  let tone: "Professional & Objective" | "Urgent & Direct" | "Academic & Analytical" | "Casual & Friendly" = "Professional & Objective";
  const lower = text.toLowerCase();
  
  if (/\b(?:urgent|critical|immediately|penalty|breach|outage|rpo|rto|failover|liability)\b/.test(lower)) {
    tone = "Urgent & Direct";
  } else if (/\b(?:methodology|theoretical|hypothesis|synthesize|microservices|architecture|telemetry)\b/.test(lower)) {
    tone = "Academic & Analytical";
  } else if (/\b(?:great|welcome|excited|happy|thanks|connect|team)\b/.test(lower)) {
    tone = "Casual & Friendly";
  }

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    readingGradeLabel,
    complexityBadge,
    avgSentenceLengthWords: Math.round(wordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(syllablesPerWord * 100) / 100,
    passiveVoicePercentage,
    sentimentTone: tone,
    sentimentScore: 0.25,
  };
}

/**
 * Generates actionable improvement suggestions tailored to the document.
 */
export function generateImprovementSuggestions(
  text: string,
  metrics: ReadabilityMetrics
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];
  const sentences = splitSentences(text);

  // 1. Sentence length check
  const overlyLongSentences = sentences.filter((s) => s.split(/\s+/).length > 32);
  if (overlyLongSentences.length > 0) {
    suggestions.push({
      id: "sug-sentence-length",
      category: "conciseness",
      severity: "medium",
      title: "Break Up Multi-Clause Run-On Sentences",
      description: `Found ${overlyLongSentences.length} sentence(s) exceeding 32 words. Dense sentences increase cognitive fatigue.`,
      recommendation: "Split complex compound sentences using bullet points, semicolons, or distinct declarative statements.",
      impact: "Boosts readability ease by +12% and accelerates executive review time.",
    });
  } else {
    suggestions.push({
      id: "sug-sentence-length-ok",
      category: "conciseness",
      severity: "success",
      title: "Sentence Cadence Is Well Balanced",
      description: "Sentence lengths are crisp and maintain reader engagement throughout.",
      recommendation: "Maintain this punchy cadence across future draft revisions.",
      impact: "High reader retention.",
    });
  }

  // 2. Passive voice check
  if (metrics.passiveVoicePercentage > 20) {
    suggestions.push({
      id: "sug-passive-voice",
      category: "grammar_tone",
      severity: "high",
      title: "Convert Passive Voice to Active Direct Language",
      description: `Passive voice accounts for ~${metrics.passiveVoicePercentage}% of key statements (e.g. "services will be deployed by..." vs "DevOps deploys services...").`,
      recommendation: "Attribute explicit ownership to teams, systems, or entities to instill accountability.",
      impact: "Improves authority, clarity of responsibility, and direct tone.",
    });
  }

  // 3. Document structure & headings
  const hasHeaders = /^[\d.]+\s+[A-Z]|#{1,3}\s+[A-Z]/m.test(text);
  if (!hasHeaders) {
    suggestions.push({
      id: "sug-structure-headers",
      category: "structure",
      severity: "medium",
      title: "Incorporate Section Numbering & Thematic Headers",
      description: "The document lacks clear visual hierarchical headers, making scanning difficult for executive readers.",
      recommendation: "Organize into numbered sections: 1. Executive Summary, 2. Key Objectives, 3. Technical Requirements, 4. SLA & Deliverables.",
      impact: "Enables readers to jump to critical provisions in seconds.",
    });
  } else {
    suggestions.push({
      id: "sug-structure-headers-good",
      category: "structure",
      severity: "success",
      title: "Clear Hierarchical Sectioning Detected",
      description: "Document utilizes well-defined section markers and topic separations.",
      recommendation: "Keep standard section headers aligned with organizational templates.",
      impact: "Optimal scannability.",
    });
  }

  // 4. Actionable deliverables / Call to action
  const hasActionVerbs = /\b(?:timeline|milestone|deadline|deliverables|raci|next steps|sla)\b/i.test(text);
  if (!hasActionVerbs) {
    suggestions.push({
      id: "sug-action-items",
      category: "actionability",
      severity: "high",
      title: "Add Explicit 'Next Steps & Milestones' Table",
      description: "No clear action checklist or delivery milestones were identified in the conclusion.",
      recommendation: "Append a closing summary box detailing Owners, Target Dates, and Expected Outcomes.",
      impact: "Drives clear accountability and reduces follow-up email ambiguity.",
    });
  } else {
    suggestions.push({
      id: "sug-action-items-good",
      category: "actionability",
      severity: "success",
      title: "Concrete Milestones & SLAs Present",
      description: "Document defines actionable targets, timelines, and quantitative benchmarks.",
      recommendation: "Ensure milestone owner assignments are finalized before signoff.",
      impact: "High implementation clarity.",
    });
  }

  // 5. Jargon and acronym glossary
  const acronyms = text.match(/\b[A-Z]{3,6}\b/g) || [];
  const uniqueAcronyms = Array.from(new Set(acronyms));
  if (uniqueAcronyms.length > 5) {
    suggestions.push({
      id: "sug-acronyms",
      category: "clarity",
      severity: "low",
      title: "Provide Acronym Definitions on First Mention",
      description: `Identified ${uniqueAcronyms.length} acronyms (${uniqueAcronyms.slice(0, 5).join(", ")}...). Non-specialist stakeholders may lack context.`,
      recommendation: "Spell out acronyms upon first appearance or append a brief definitions table.",
      impact: "Broadens stakeholder accessibility across cross-functional leadership.",
    });
  }

  return suggestions;
}
