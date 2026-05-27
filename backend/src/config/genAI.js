import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client using your API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not configured. AI features will be unavailable.');
  console.warn('   Set GEMINI_API_KEY in your .env file to enable Google Gemini features.');
}

export const genAI = GEMINI_API_KEY 
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

/**
 * Get a validated Gemini model or throw an error if API key is missing
 * Use this function when the API key is absolutely required
 */
export function getValidatedGenAI() {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not configured. ' +
      'Set it in your .env file or supply your own key via the X-AI-Key header.'
    );
  }
  return genAI;
}
