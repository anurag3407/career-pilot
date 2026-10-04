import express from "express";
import rateLimit from "express-rate-limit";
import { generateCoverLetter, extractResumeFromPDF } from "../services/coverLetterService.js";
import { verifyToken } from "../middleware/auth.js";
import PDFDocument from "pdfkit";

const router = express.Router();

// Max 10 cover-letter AI requests per user per 15 minutes to prevent quota abuse
const coverLetterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.uid || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({
      success: false,
      error: "Too many cover letter requests. Please wait before trying again.",
    }),
});

// POST /api/cover-letter/extract-resume
// Accepts base64 PDF and extracts resume text using Groq
router.post("/extract-resume", verifyToken, coverLetterLimiter, async (req, res) => {
  try {
    const { base64PDF } = req.body;
    if (!base64PDF) {
      return res.status(400).json({ error: "base64PDF is required" });
    }
    const resumeText = await extractResumeFromPDF(base64PDF);
    res.json({ resumeText });
  } catch (error) {
    console.error("Resume extraction error:", error);
    res.status(500).json({ error: "Failed to extract resume text" });
  }
});

// POST /api/cover-letter/generate-text
router.post("/generate-text", verifyToken, coverLetterLimiter, async (req, res) => {
  try {
    const { resumeText, jobDescription, companyName, hiringManager, tone } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" });
    }

    // Guard against oversized payloads reaching the AI provider (DoS / API-credit drain)
    if (resumeText.length > 50_000) {
      return res.status(413).json({ error: "resumeText is too long (max 50,000 characters)" });
    }

    if (jobDescription.length > 10_000) {
      return res.status(413).json({ error: "jobDescription is too long (max 10,000 characters)" });
    }

    const coverLetter = await generateCoverLetter({
      resumeText,
      jobDescription,
      companyName,
      hiringManager,
      tone,
    });

    res.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

// POST /api/cover-letter/download-pdf
router.post("/download-pdf", verifyToken, async (req, res) => {
  try {
    const { coverLetter, candidateName = "Candidate" } = req.body;
    if (!coverLetter) {
      return res.status(400).json({ error: "coverLetter is required" });
    }

    const doc = new PDFDocument({ margin: 72, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="cover-letter.pdf"`);
    doc.pipe(res);

    // Header styling
    doc.fontSize(11).font("Helvetica");

    const paragraphs = coverLetter.split(/\n+/).filter((p) => p.trim());
    paragraphs.forEach((para, i) => {
      if (i > 0) doc.moveDown(0.6);
      // Bold the subject line
      if (para.startsWith("Re:") || para.startsWith("Subject:")) {
        doc.font("Helvetica-Bold").text(para).font("Helvetica");
      } else if (para.startsWith("Sincerely") || para.startsWith("Best regards")) {
        doc.moveDown(0.5).text(para);
      } else {
        doc.text(para, { align: "justify", lineGap: 3 });
      }
    });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;