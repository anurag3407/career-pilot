import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const extractResumeFromPDF = async (base64PDF) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `I am going to give you a base64-encoded PDF resume. Extract and summarize all the key information from it including: name, contact info, skills, work experience, education, projects, certifications, and any other relevant details. Return it as clean structured text.

Base64 PDF data: ${base64PDF.substring(0, 8000)}

Extract whatever you can from this data and structure it clearly.`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || "";
};

export const generateCoverLetter = async ({
  resumeText,
  jobDescription,
  companyName = "",
  hiringManager = "",
  tone = "formal",
}) => {
  const toneGuide = {
    formal: "professional and formal",
    conversational: "friendly and conversational",
    enthusiastic: "energetic and enthusiastic",
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `You are an expert cover letter writer. Generate a complete, properly formatted cover letter.

RESUME INFORMATION:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

${companyName ? `COMPANY: ${companyName}` : ""}
${hiringManager ? `HIRING MANAGER: ${hiringManager}` : ""}
TONE: ${toneGuide[tone] || toneGuide.formal}
DATE: ${today}

Write a complete cover letter with this exact structure:
1. Date (${today})
2. Blank line
3. Hiring Manager name and company (if provided)
4. Blank line
5. Subject line: "Re: Application for [Role]"
6. Blank line
7. Salutation (Dear ${hiringManager || "Hiring Manager"},)
8. Blank line
9. Opening paragraph - strong hook connecting your background to the role
10. Blank line
11. Body paragraph - specific skills and experiences matching the JD
12. Blank line
13. Value paragraph - what you will bring to the company
14. Blank line
15. Closing paragraph - call to action
16. Blank line
17. Sincerely,
18. [Candidate Name from resume]

Output ONLY the cover letter, nothing else.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1200,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "";
};