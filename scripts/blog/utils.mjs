import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiApiKey, geminiModel } from './config.mjs';

// Initialize model
const genAI = new GoogleGenerativeAI(geminiApiKey);
export const model = genAI.getGenerativeModel({ model: geminiModel });

// ─────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────
export function getCurrentMonthYear() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  return { month, year, label: `${month} ${year}` };
}

export function daysAgoTimestamp(days) {
  return Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
}

// ─────────────────────────────────────────────
// Retry helper with exponential backoff
// ─────────────────────────────────────────────
export async function withRetry(fn, { retries = 3, baseDelayMs = 1000, label = 'operation' } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** (attempt - 1);
        console.warn(`  ⏳ ${label} failed (attempt ${attempt}/${retries}): ${err.message}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`${label} failed after ${retries} attempts: ${lastError.message}`);
}

// Wraps a Gemini generateContent call with retry + JSON cleanup/parsing.
// Retries on both network/API errors AND malformed JSON responses.
export async function callGeminiJSON(prompt, { retries = 3, baseDelayMs = 1000, label = 'Gemini call' } = {}) {
  return withRetry(
    async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return JSON.parse(text);
      } catch (err) {
        throw new Error(`invalid JSON response (${err.message})`);
      }
    },
    { retries, baseDelayMs, label }
  );
}
