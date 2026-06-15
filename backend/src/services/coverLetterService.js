import Groq from "groq-sdk";

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in environment variables.");
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

export const extractResumeFromPDF = async (base64PDF) => {
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Extract and summarize all key information from this resume. Include: full name, contact details, skills, work experience, education, projects, and certifications. Return clean structured text only.

Resume data (base64 excerpt): ${base64PDF.substring(0, 6000)}`,
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
    year: "numeric", month: "long", day: "numeric",
  });

  const prompt = `You are an expert cover letter writer. Generate a complete, properly formatted cover letter.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

${companyName ? `COMPANY: ${companyName}` : ""}
${hiringManager ? `HIRING MANAGER: ${hiringManager}` : ""}
TONE: ${toneGuide[tone] || toneGuide.formal}
TODAY'S DATE: ${today}

Write the cover letter with this structure:
- Date
- Recipient (Hiring Manager name + Company if provided)
- Subject: Re: Application for [Role inferred from JD]
- Dear ${hiringManager || "Hiring Manager"},
- Opening paragraph: strong hook
- Body paragraph: matching skills/experience to the JD
- Value paragraph: what you bring to the company
- Closing paragraph: call to action
- Sincerely, [Name from resume]

Output ONLY the cover letter text, nothing else.`;

  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1200,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || "";
};