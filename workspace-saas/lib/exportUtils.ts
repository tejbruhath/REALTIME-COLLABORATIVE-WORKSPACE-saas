import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

// Convert TipTap JSON content to plain text for export
export function contentToPlainText(content: any): string {
  if (!content) return "";
  
  // If it's already a string, return it
  if (typeof content === "string") {
    // Remove HTML tags if present
    let text = content.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return text;
  }

  // If it's TipTap JSON format
  if (content.type === "doc" && content.content) {
    return extractTextFromNodes(content.content);
  }

  return JSON.stringify(content);
}

function extractTextFromNodes(nodes: any[]): string {
  let text = "";
  
  for (const node of nodes) {
    if (node.type === "text") {
      text += node.text || "";
    } else if (node.type === "hardBreak") {
      text += "\n";
    } else if (node.content) {
      text += extractTextFromNodes(node.content);
      // Add line breaks after paragraphs and headings
      if (["paragraph", "heading"].includes(node.type)) {
        text += "\n\n";
      }
    }
  }
  
  return text;
}

// Export document as PDF
export async function exportToPDF(title: string, content: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Add title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, yPosition);
  yPosition += 15;

  // Add content
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  
  const plainText = contentToPlainText(content);
  const lines = doc.splitTextToSize(plainText, maxWidth);

  lines.forEach((line: string) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 7;
  });

  // Save the PDF
  doc.save(`${title}.pdf`);
}

// Export document as DOCX
export async function exportToDOCX(title: string, content: any) {
  const plainText = contentToPlainText(content);
  const paragraphs = plainText.split("\n").filter((p) => p.trim());

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...paragraphs.map(
            (text) =>
              new Paragraph({
                children: [new TextRun(text)],
                spacing: {
                  after: 200,
                },
              })
          ),
        ],
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
}
