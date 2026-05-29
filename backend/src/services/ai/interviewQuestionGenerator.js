// backend/src/services/ai/interviewQuestionGenerator.js

import { getDefaultProvider } from '../../config/aiProviders.js';

/**
 * Generates highly tailored interview questions based on user portfolio data.
 * @param {Object} portfolioData - The profile/portfolio details of the user.
 * @returns {Promise<Array>} List of 18 categorized interview questions.
 */
export const generateQuestions = async (portfolioData) => {
  const { skills = [], projects = [], experience = [] } = portfolioData || {};

  if (!skills.length && !projects.length && !experience.length) {
    return getMockFallbackQuestions({ name: "Developer" });
  }

  try {
    const provider = getDefaultProvider();

    const prompt = `
You are an expert technical interviewer. Generate exactly 18 highly tailored interview questions based on this user's profile:
Skills: ${JSON.stringify(skills)}
Projects: ${JSON.stringify(projects)}
Experience: ${JSON.stringify(experience)}

CRITICAL REQUIREMENT: Do NOT generate generic questions. Incorporate specific technologies, project architectures, and roles from their profile.

Format your entire response as a valid JSON array of objects. Each object must have these exact keys:
- "id": unique number
- "type": either "Technical", "Behavioral", or "Project Deep-Dive"
- "difficulty": either "Easy", "Medium", or "Hard"
- "question": the actual question string

Ensure exactly 6 questions per type, evenly distributed across Easy, Medium, and Hard.
Return ONLY the JSON array, no markdown code blocks, no explanations.
`;

    const result = await provider.generateContent(prompt);
    const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleanedText);

    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }

    return getMockFallbackQuestions(portfolioData);
  } catch (error) {
    console.warn("AI Question Generator fallback:", error.message);
    return getMockFallbackQuestions(portfolioData);
  }
};

/**
 * Generates structured, highly specific questions locally using profile context.
 */
const getMockFallbackQuestions = (data) => {
  const topSkill = data.skills?.[0] || "Frontend Development";
  const secondSkill = data.skills?.[1] || "JavaScript";
  const mainProject = data.projects?.[0]?.title || "E-Commerce System";
  const mainRole = data.experience?.[0]?.role || "Software Engineer";

  return [
    { id: 1, type: "Technical", difficulty: "Easy", question: `What are the core lifecycle hooks or fundamental architecture constraints when building an application with ${topSkill}?` },
    { id: 2, type: "Technical", difficulty: "Easy", question: `Explain the core difference between state management and structural prop drilling in modern ${secondSkill} projects.` },
    { id: 3, type: "Technical", difficulty: "Medium", question: `How would you handle asynchronous multi-criteria processing safely inside a ${topSkill} layout environment?` },
    { id: 4, type: "Technical", difficulty: "Medium", question: `Describe how you optimize the database indexes or initial render footprints for an application using ${secondSkill}.` },
    { id: 5, type: "Technical", difficulty: "Hard", question: `Can you walk me through the memory allocation pitfalls or deep garbage collection logic you need to watch out for in ${topSkill}?` },
    { id: 6, type: "Technical", difficulty: "Hard", question: `Design a system layout that securely streams structural updates to thousands of live users using your stack profile.` },

    { id: 7, type: "Project Deep-Dive", difficulty: "Easy", question: `What inspired the structural design patterns behind your project, "${mainProject}"?` },
    { id: 8, type: "Project Deep-Dive", difficulty: "Easy", question: `If you had to re-architect "${mainProject}" from scratch tomorrow, what tool or language choice would you eliminate?` },
    { id: 9, type: "Project Deep-Dive", difficulty: "Medium", question: `Walk me through how you handled data state validations or asynchronous state handling inside "${mainProject}".` },
    { id: 10, type: "Project Deep-Dive", difficulty: "Medium", question: `How did you handle race conditions or authorization bottlenecks when multiple clients hit features inside "${mainProject}"?` },
    { id: 11, type: "Project Deep-Dive", difficulty: "Hard", question: `Imagine "${mainProject}" encounters a 100x spike in read/write traffic right now. Where does the server bottle-neck first?` },
    { id: 12, type: "Project Deep-Dive", difficulty: "Hard", question: `How did you establish end-to-end security configurations to make sure user data inside "${mainProject}" stayed safe?` },

    { id: 13, type: "Behavioral", difficulty: "Easy", question: `What was the most rewarding technical hurdle you resolved while acting as a ${mainRole}?` },
    { id: 14, type: "Behavioral", difficulty: "Easy", question: `Tell me about a time you had to pick up a tool outside your immediate ${topSkill} comfort zone to complete a target.` },
    { id: 15, type: "Behavioral", difficulty: "Medium", question: `Describe a situation as a ${mainRole} where a feature requirements document was completely vague. How did you proceed?` },
    { id: 16, type: "Behavioral", difficulty: "Medium", question: `Tell me about a time you disagreed with an architectural decision on a project. How did you communicate your alternative?` },
    { id: 17, type: "Behavioral", difficulty: "Hard", question: `Give me an example of a massive production crash or major bug you introduced while working on an experience. What did you learn?` },
    { id: 18, type: "Behavioral", difficulty: "Hard", question: `How do you manage balancing your technical debt tasks with fast-paced delivery deadlines in your daily workspace workflow?` }
  ];
};
