import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { nanoid } from 'nanoid';

// Configuration
const sanityConfig = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-03-21',
  useCdn: false,
};

const serperApiKey = process.env.SERPER_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

if (!sanityConfig.projectId || !sanityConfig.token || !serperApiKey || !geminiApiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const client = createClient(sanityConfig);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: geminiModel });

// ─────────────────────────────────────────────
// STEP 1: Multi-query trending topic research
// ─────────────────────────────────────────────
async function searchSerper(query) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': serperApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, num: 10 }),
  });

  if (!response.ok) throw new Error(`Serper error: ${response.statusText}`);
  const data = await response.json();

  return data.organic
    .map((item) => `TITLE: ${item.title}\nSNIPPET: ${item.snippet}\nURL: ${item.link}`)
    .join('\n---\n');
}

async function getTrendingResearch() {
  console.log('🔍 Running multi-query trend research...');

  const queries = [
    'trending agentic AI frameworks and tools 2025',
    'next.js full stack development best practices 2025',
    'AI automation developer tools trending this week',
    'top SEO keywords full stack developer blog 2025',
  ];

  const results = await Promise.all(queries.map(searchSerper));

  return results
    .map((result, i) => `=== RESEARCH QUERY ${i + 1}: ${queries[i]} ===\n${result}`)
    .join('\n\n');
}

// ─────────────────────────────────────────────
// STEP 2: AI picks the best topic + keywords
// ─────────────────────────────────────────────
async function selectTopicAndKeywords(research) {
  console.log('🎯 Selecting best topic and SEO keywords...');

  const prompt = `
You are an SEO strategist for a Full Stack & Agentic AI developer's portfolio blog.

Based on the following real search research data, your job is to:
1. Identify the single most trending and rankable blog topic
2. Extract 5-8 high-traffic SEO keywords specifically for that topic

Research Data:
${research}

Rules:
- Pick a topic that has real search demand RIGHT NOW based on the research
- Keywords must be specific long-tail phrases people actually search (e.g. "how to build agentic AI with LangGraph" not just "AI")
- The topic must be relevant to: Next.js, TypeScript, Agentic AI, AI Automation, Full Stack Development

Return ONLY a raw JSON object like this (no markdown, no explanation):
{
  "topic": "The exact blog topic title direction",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}

// ─────────────────────────────────────────────
// STEP 3: Generate full SEO blog post
// ─────────────────────────────────────────────
async function generatePost(topic, keywords, research) {
  console.log(`✍️ Writing blog post on: ${topic}`);

  const prompt = `
You are Shiraz Ali — a Full Stack & Agentic AI Developer based in Karachi, Pakistan. 
You write developer-focused blog posts for your portfolio website to rank on Google and attract clients.

TOPIC TO WRITE ABOUT: ${topic}

PRIMARY SEO KEYWORDS TO NATURALLY INCLUDE:
${keywords.map((k, i) => `${i + 1}. ${k}`).join('\n')}

REAL RESEARCH CONTEXT (use this, do not make things up):
${research.slice(0, 3000)}

═══════════════════════════════════════════
BLOG POST REQUIREMENTS
═══════════════════════════════════════════

STRUCTURE (follow this exactly):
- H1-style Title: SEO-optimized, includes primary keyword
- Introduction paragraph: Hook the reader, mention the problem being solved (150+ words)
- 5-7 H2 sections minimum, each with:
    - 2-3 paragraphs of detailed explanation (each paragraph 80-120 words)
    - Practical examples or code context where relevant
- 1 blockquote per major section (insight or key takeaway)
- Conclusion section with CTA (e.g. "Want to build this? Connect with me")
- Minimum total length: 1500 words

SEO RULES:
- Include primary keyword in: title, first paragraph, at least 2 H2 headings, conclusion
- Use secondary keywords naturally throughout the body
- Each H2 section should target a specific user search intent
- Write like a real developer explaining to another developer — not generic AI fluff

PORTABLE TEXT FORMAT:
Every block in the body array MUST follow this structure exactly:
{
  "_type": "block",
  "_key": "unique_string_here",
  "style": "normal" | "h2" | "h3" | "blockquote",
  "markDefs": [],
  "children": [
    {
      "_type": "span",
      "_key": "unique_string_here",
      "marks": [],
      "text": "your text here"
    }
  ]
}

RETURN ONLY this raw JSON object (absolutely no markdown code blocks, no explanation):
{
  "title": "SEO-optimized title here",
  "slug": "url-friendly-slug-here",
  "excerpt": "2 sentence compelling summary with primary keyword",
  "metaTitle": "SEO meta title under 60 chars",
  "metaDescription": "SEO meta description under 155 chars with primary keyword",
  "category": "one of: Agentic AI | AI Products | Full Stack | Web Engineering",
  "heroLabel": "short catchy phrase like 'Systems that execute'",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "readTime": "X min read",
  "body": [ ...portable text blocks... ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

  const postData = JSON.parse(text);

  // Ensure every block has a valid _key (critical for Sanity)
  postData.body = postData.body.map((block) => ({
    ...block,
    _key: block._key || nanoid(),
    children: block.children?.map((child) => ({
      ...child,
      _key: child._key || nanoid(),
    })),
  }));

  return postData;
}

// ─────────────────────────────────────────────
// STEP 4: Publish to Sanity
// ─────────────────────────────────────────────
async function publishToSanity(postData) {
  console.log(`📤 Publishing: ${postData.title}`);

  const existing = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]`,
    { slug: postData.slug }
  );

  if (existing) {
    console.log('⚠️ Post with this slug already exists. Skipping...');
    return;
  }

  const doc = {
    _type: 'post',
    title: postData.title,
    slug: { _type: 'slug', current: postData.slug },
    excerpt: postData.excerpt,
    metaTitle: postData.metaTitle,
    metaDescription: postData.metaDescription,
    date: new Date().toISOString(),
    readTime: postData.readTime,
    category: postData.category,
    heroLabel: postData.heroLabel,
    tags: postData.tags,
    body: postData.body,
  };

  const result = await client.create(doc);
  console.log(`✅ Published! Document ID: ${result._id}`);
}

// ─────────────────────────────────────────────
// MAIN PIPELINE
// ─────────────────────────────────────────────
async function run() {
  try {
    console.log('🚀 Starting AI Blog Pipeline...\n');

    const research = await getTrendingResearch();
    const { topic, keywords } = await selectTopicAndKeywords(research);

    console.log(`\n📌 Selected Topic: ${topic}`);
    console.log(`🔑 Keywords: ${keywords.join(', ')}\n`);

    const postData = await generatePost(topic, keywords, research);
    await publishToSanity(postData);

    console.log('\n🎉 Pipeline completed successfully.');
  } catch (error) {
    console.error('❌ Pipeline failed:', error.message);
    process.exit(1);
  }
}

run();


