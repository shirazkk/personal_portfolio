export const sanityConfig = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-21',
  useCdn: false,
};

export const serperApiKey = process.env.SERPER_API_KEY;
export const geminiApiKey = process.env.GEMINI_API_KEY;
export const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
