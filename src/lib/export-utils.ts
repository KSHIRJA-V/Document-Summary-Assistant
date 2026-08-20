import { SummaryData } from "@/types";
import { jsPDF } from "jspdf";

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Clipboard copy error:", err);
    return false;
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdownExport(summary: SummaryData, docTitle: string): string {
  const lines: string[] = [
    `# Summary: ${docTitle}`,
    `*Length: ${summary.length.toUpperCase()}*`,
    ``,
    `---`,
    ``,
    `## Overview`,
    `${summary.overview}`,
    ``,
    `## Key Points & Takeaways`,
    ...summary.keyTakeaways.map((t) => `- ${t}`),
    ``,
  ];

  if (summary.sections && summary.sections.length > 0) {
    lines.push(`## Section Details`);
    for (const sec of summary.sections) {
      lines.push(`### ${sec.title}`);
      lines.push(`${sec.content}`);
      if (sec.bullets && sec.bullets.length > 0) {
        lines.push(``);
        lines.push(...sec.bullets.map((b) => `  * ${b}`));
      }
      lines.push(``);
    }
  }

  if (summary.entities) {
    lines.push(`## Key Entities & Extracted Data`);
    if (summary.entities.datesAndDeadlines.length > 0) {
      lines.push(`- **Dates & Deadlines**: ${summary.entities.datesAndDeadlines.join(", ")}`);
    }
    if (summary.entities.metricsAndNumbers.length > 0) {
      lines.push(`- **Key Numbers & Metrics**: ${summary.entities.metricsAndNumbers.join(", ")}`);
    }
    if (summary.entities.actionItems.length > 0) {
      lines.push(`- **Action Items**:`);
      lines.push(...summary.entities.actionItems.map((a) => `  * ${a}`));
    }
    lines.push(``);
  }

  return lines.join("\n");
}

export function exportToPdf(summary: SummaryData, docTitle: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 24;

  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 16, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DOCUMENT SUMMARY ASSISTANT", margin, 11);

  yPos = 28;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const splitTitle = doc.splitTextToSize(docTitle, contentWidth);
  doc.text(splitTitle, margin, yPos);
  yPos += (splitTitle.length * 7) + 2;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Length: ${summary.length.toUpperCase()} | Words: ~${summary.wordCount} | Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 6;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("1. Overview", margin, yPos);
  yPos += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const splitOverview = doc.splitTextToSize(summary.overview, contentWidth);
  doc.text(splitOverview, margin, yPos);
  yPos += (splitOverview.length * 5.2) + 8;

  if (yPos > 240) {
    doc.addPage();
    yPos = 24;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("2. Key Points & Takeaways", margin, yPos);
  yPos += 6;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  for (const takeaway of summary.keyTakeaways) {
    if (yPos > 260) {
      doc.addPage();
      yPos = 24;
    }
    const splitT = doc.splitTextToSize(`• ${takeaway}`, contentWidth);
    doc.text(splitT, margin, yPos);
    yPos += (splitT.length * 5) + 3;
  }

  yPos += 4;

  if (summary.sections && summary.sections.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 24;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("3. Details", margin, yPos);
    yPos += 6;

    for (const sec of summary.sections) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 24;
      }

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(sec.title, margin, yPos);
      yPos += 5;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const splitSec = doc.splitTextToSize(sec.content, contentWidth);
      doc.text(splitSec, margin, yPos);
      yPos += (splitSec.length * 4.8) + 4;
    }
  }

  const safeFilename = docTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase().slice(0, 35);
  doc.save(`${safeFilename}_summary.pdf`);
}
