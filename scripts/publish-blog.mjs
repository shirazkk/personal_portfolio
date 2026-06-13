import { createClient } from '@sanity/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { nanoid } from 'nanoid';
import googleTrends from 'google-trends-api';

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────
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
// Date helpers (for dynamic, time-anchored queries)
// ─────────────────────────────────────────────
function getCurrentMonthYear() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  return { month, year, label: `${month} ${year}` };
}

function daysAgoTimestamp(days) {
  return Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
}

// ─────────────────────────────────────────────
// Retry helper with exponential backoff
// ─────────────────────────────────────────────
async function withRetry(fn, { retries = 3, baseDelayMs = 1000, label = 'operation' } = {}) {
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
async function callGeminiJSON(prompt, { retries = 3, baseDelayMs = 1000, label = 'Gemini call' } = {}) {
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

// ─────────────────────────────────────────────
// STEP 1a: Serper News search (date-anchored, company-agnostic)
// ─────────────────────────────────────────────
async function searchSerperNews(query) {
  return withRetry(
    async () => {
      const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 10 }),
      });

      if (!response.ok) throw new Error(`Serper news error: ${response.statusText}`);
      const data = await response.json();

      if (!data.news || data.news.length === 0) return '(no results)';

      return data.news
        .map(
          (item) =>
            `TITLE: ${item.title}\nSNIPPET: ${item.snippet || ''}\nDATE: ${item.date || 'unknown'}\nSOURCE: ${item.source || ''}\nURL: ${item.link}`
        )
        .join('\n---\n');
    },
    { retries: 3, baseDelayMs: 1000, label: `Serper news "${query}"` }
  );
}

// ─────────────────────────────────────────────
// STEP 1a (fallback): Serper organic search
// ─────────────────────────────────────────────
async function searchSerperOrganic(query) {
  return withRetry(
    async () => {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 10 }),
      });

      if (!response.ok) throw new Error(`Serper search error: ${response.statusText}`);
      return response.json();
    },
    { retries: 3, baseDelayMs: 1000, label: `Serper search "${query}"` }
  );
}

// ─────────────────────────────────────────────
// STEP 1b: Hacker News Algolia (free, no key, sorted by date)
// ─────────────────────────────────────────────
async function searchHNAlgolia(query) {
  return withRetry(
    async () => {
      const sevenDaysAgo = daysAgoTimestamp(7);
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
        query
      )}&tags=story&numericFilters=created_at_i>${sevenDaysAgo}&hitsPerPage=10`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HN Algolia error: ${response.statusText}`);
      const data = await response.json();

      if (!data.hits || data.hits.length === 0) return '(no results)';

      return data.hits
        .map((hit) => {
          const date = new Date(hit.created_at).toISOString().split('T')[0];
          return `TITLE: ${hit.title}\nPOINTS: ${hit.points || 0}\nCOMMENTS: ${hit.num_comments || 0}\nDATE: ${date}\nURL: ${hit.url || `https://news.ycombinator.com/item?id=${hit.story_id}`}`;
        })
        .join('\n---\n');
    },
    { retries: 3, baseDelayMs: 1000, label: `HN Algolia "${query}"` }
  );
}

// ─────────────────────────────────────────────
// STEP 1: Combined dynamic research (replaces getTrendingResearch)
// ─────────────────────────────────────────────
async function getTrendingResearch() {
  console.log('🔍 Running dynamic, date-anchored trend research...');

  const { month, year, label } = getCurrentMonthYear();

  const newsQueries = [
    `AI model release ${label}`,
    `new AI agent framework ${label}`,
    `Next.js TypeScript update ${label}`,
    `developer tools launch this week AI`,
    `agentic AI news ${label}`,
    `AI automation news ${label}`,
    `AI news ${label}`,
    `AI agent news ${label}`,
  ];

  const hnQueries = ['AI agent', 'LLM', 'Next.js', 'TypeScript', 'AI framework'];

  console.log(`  📅 Anchoring queries to: ${label}`);

  const newsResultsRaw = await Promise.all(
    newsQueries.map(async (q) => {
      try {
        const result = await searchSerperNews(q);
        return { query: q, result };
      } catch (err) {
        console.warn(`  ⚠️ News query failed "${q}": ${err.message}`);
        return { query: q, result: '(error fetching results)' };
      }
    })
  );

  const hnResultsRaw = await Promise.all(
    hnQueries.map(async (q) => {
      try {
        const result = await searchHNAlgolia(q);
        return { query: q, result };
      } catch (err) {
        console.warn(`  ⚠️ HN query failed "${q}": ${err.message}`);
        return { query: q, result: '(error fetching results)' };
      }
    })
  );

  const newsSection = newsResultsRaw
    .map((r) => `=== NEWS (${label}): "${r.query}" ===\n${r.result}`)
    .join('\n\n');

  const hnSection = hnResultsRaw
    .map((r) => `=== HACKER NEWS (last 7 days): "${r.query}" ===\n${r.result}`)
    .join('\n\n');

  return `${newsSection}\n\n${hnSection}`;
}

// ─────────────────────────────────────────────
// STEP 2: Strict topic + keyword selection with self-check
// ─────────────────────────────────────────────
async function generateTopicCandidate(research, label, feedback = null) {
  const feedbackBlock = feedback
    ? `\n\nIMPORTANT: A previous candidate was rejected as too generic. Feedback: "${feedback}"\nGenerate a DIFFERENT, more specific topic this time.`
    : '';

  const prompt = `
You are an SEO strategist for a Full Stack & Agentic AI developer's portfolio blog.

Today's date context: ${label}

Based on the following real, dated research data, your job is to:
1. Identify ONE blog topic that is tied to a SPECIFIC named tool, model, framework, version number, or event mentioned in the research below — NOT a generic evergreen topic.
2. Extract 5-8 SEO keywords specifically for that topic. Keywords must be specific long-tail phrases people actually search.
3. Provide "sourceEvidence": a short quote or reference (1-2 sentences) from the research that justifies why this topic is tied to something NEW and RECENT.

Research Data:
${research}

STRICT RULES:
- The topic title MUST explicitly name a specific tool, product, model, framework, or release version found in the research (e.g. "Claude Opus 4.6", "Next.js 15.4", "LangGraph v0.3", a named startup/product).
- REJECT any topic that could have been written without today's research (e.g. "The Future of Agentic AI", "Why AI Agents Matter in 2026" — these are too generic).
- The topic must still be relevant to: Next.js, TypeScript, Agentic AI, AI Automation, Full Stack Development — but the HOOK must be the specific new thing, with the dev-stack angle as the application/tie-in.
- Keywords must be specific long-tail phrases (e.g. "how to use Claude Opus 4.6 with LangGraph" not just "AI agents").
${feedbackBlock}

Return ONLY a raw JSON object like this (no markdown, no explanation):
{
  "topic": "The exact blog topic title direction, naming the specific tool/release",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "sourceEvidence": "Short quote/reference from research justifying why this is new"
}
`;

  return callGeminiJSON(prompt, { retries: 3, baseDelayMs: 1500, label: 'Topic candidate generation' });
}
async function checkTopicSpecificity(candidate) {
  const prompt = `
You are reviewing a proposed blog topic for genericness.

Proposed topic: "${candidate.topic}"
Source evidence provided: "${candidate.sourceEvidence}"

QUESTION: Could this exact topic title have been written WITHOUT the source evidence above — i.e. is it a generic, evergreen-sounding title that doesn't actually require knowledge of a specific recent release, tool, or event?

Answer with ONLY a raw JSON object (no markdown, no explanation):
{
  "isGeneric": true | false,
  "reason": "one sentence explanation"
}
`;

  return callGeminiJSON(prompt, { retries: 3, baseDelayMs: 1500, label: 'Topic specificity check' });
}

async function selectTopicAndKeywords(research) {
  console.log('🎯 Selecting specific, news-tied topic and SEO keywords...');

  const { label } = getCurrentMonthYear();
  const maxRetries = 2;
  let candidate = null;
  let feedback = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    candidate = await generateTopicCandidate(research, label, feedback);
    console.log(`  Attempt ${attempt + 1}: "${candidate.topic}"`);

    const check = await checkTopicSpecificity(candidate);

    if (!check.isGeneric) {
      candidate.specificityCheckPassed = true;
      console.log('  ✅ Specificity check passed.');
      return candidate;
    }

    console.log(`  ⚠️ Rejected as generic: ${check.reason}`);
    feedback = check.reason;
  }

  console.warn('  ⚠️ Max retries reached. Proceeding with best available candidate (flagged for review).');
  candidate.specificityCheckPassed = false;
  return candidate;
}


// ─────────────────────────────────────────────
// STEP 2c: SEO keyword validation (Trends + related searches + refinement)
// ─────────────────────────────────────────────
async function getTrendForKeyword(keyword) {
  try {
    const resultsJson = await withRetry(
      () =>
        googleTrends.interestOverTime({
          keyword,
          startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        }),
      { retries: 2, baseDelayMs: 1000, label: `Google Trends "${keyword}"` }
    );

    const parsed = JSON.parse(resultsJson);
    const points = parsed?.default?.timelineData || [];

    if (points.length < 2) return 'flat';

    const values = points.map((p) => Number(p.value?.[0] || 0));
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
    const firstAvg = avg(firstHalf);
    const secondAvg = avg(secondHalf);

    if (secondAvg === 0 && firstAvg === 0) return 'declining/zero';
    if (secondAvg > firstAvg * 1.15) return 'rising';
    if (secondAvg < firstAvg * 0.85) return 'declining/zero';
    return 'flat';
  } catch (err) {
    console.warn(`  ⚠️ Trends lookup failed for "${keyword}": ${err.message}`);
    return 'unknown';
  }
}

async function getRelatedSearches(keyword) {
  try {
    const data = await searchSerperOrganic(keyword);
    const related = (data.relatedSearches || []).map((r) => r.query).filter(Boolean);
    const paa = (data.peopleAlsoAsk || []).map((r) => r.question).filter(Boolean);
    return [...related, ...paa];
  } catch (err) {
    console.warn(`  ⚠️ Related searches failed for "${keyword}": ${err.message}`);
    return [];
  }
}

async function refineKeywords(originalKeywords, trendData, relatedCandidates, topic) {
  const prompt = `
You are refining an SEO keyword list for a blog post.

Topic: "${topic}"

Original candidate keywords with their Google Trends signal (last 30 days):
${trendData.map((k) => `- "${k.keyword}" → ${k.trend}`).join('\n')}

Additional related search / "people also ask" phrases found:
${relatedCandidates.length ? relatedCandidates.map((r) => `- "${r}"`).join('\n') : '(none found)'}

TASK: Select the final 5-8 keywords for this blog post.
- Prioritize keywords marked "rising".
- Incorporate relevant related-search/PAA phrases where they fit the topic.
- Drop keywords marked "declining/zero" unless there is no viable alternative.
- Keywords marked "unknown" or "flat" can be kept if topically strong.

Return ONLY a raw JSON object (no markdown, no explanation):
{
  "finalKeywords": [
    {"keyword": "...", "trend": "rising|flat|declining/zero|unknown"},
    ...
  ]
}
`;

  const parsed = await callGeminiJSON(prompt, { retries: 3, baseDelayMs: 1500, label: 'Keyword refinement' });
  return parsed.finalKeywords;
}

async function validateAndRefineKeywords(topic, keywords) {
  console.log('📊 Validating keywords with Google Trends + related searches...');

  let trendData;
  try {
    trendData = await Promise.all(
      keywords.map(async (keyword) => ({
        keyword,
        trend: await getTrendForKeyword(keyword),
      }))
    );
  } catch (err) {
    console.warn(`  ⚠️ Trends validation failed entirely: ${err.message}. Using original keywords.`);
    return keywords.map((k) => ({ keyword: k, trend: 'unknown' }));
  }

  let relatedCandidates = [];
  try {
    // Use the first 1-2 primary keywords for related-search lookups
    const primary = keywords.slice(0, 2);
    const relatedResults = await Promise.all(primary.map(getRelatedSearches));
    relatedCandidates = [...new Set(relatedResults.flat())].slice(0, 10);
  } catch (err) {
    console.warn(`  ⚠️ Related searches step failed: ${err.message}`);
  }

  try {
    const finalKeywords = await refineKeywords(keywords, trendData, relatedCandidates, topic);
    console.log(
      `  ✅ Final keywords: ${finalKeywords.map((k) => `${k.keyword} (${k.trend})`).join(', ')}`
    );
    return finalKeywords;
  } catch (err) {
    console.warn(`  ⚠️ Keyword refinement failed: ${err.message}. Using trend-tagged originals.`);
    return trendData;
  }
}

// ─────────────────────────────────────────────
// STEP 3: Generate full SEO blog post
// ─────────────────────────────────────────────
async function generatePost(topic, keywords, sourceEvidence, research) {
  console.log(`✍️ Writing blog post on: ${topic}`);

  const { label } = getCurrentMonthYear();
  const keywordList = keywords.map((k) => (typeof k === 'string' ? k : k.keyword));

  const prompt = `
You are Shiraz Ali — a Full Stack & Agentic AI Developer based in Karachi, Pakistan. 
You write developer-focused blog posts for your portfolio website to rank on Google and attract clients.

CURRENT DATE CONTEXT: ${label}

TOPIC TO WRITE ABOUT: ${topic}

WHY THIS IS TIMELY (use this to ground the intro and at least one section with a concrete "as of ${label}" reference):
${sourceEvidence}

PRIMARY SEO KEYWORDS TO NATURALLY INCLUDE:
${keywordList.map((k, i) => `${i + 1}. ${k}`).join('\n')}

REAL RESEARCH CONTEXT (use this, do not make things up):
${research.slice(0, 3000)}

═══════════════════════════════════════════
BLOG POST REQUIREMENTS
═══════════════════════════════════════════

STRUCTURE (follow this exactly):
- H1-style Title: SEO-optimized, includes primary keyword, and names the specific tool/release from the topic
- Introduction paragraph: Hook the reader with the recent/specific news angle, mention the problem being solved (150+ words)
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
- Reference the specific tool/release/version by name multiple times to reinforce topical relevance and freshness

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

  const postData = await withRetry(
    async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        throw new Error(`invalid JSON response (${err.message})`);
      }
      if (!Array.isArray(parsed.body) || parsed.body.length === 0) {
        throw new Error('response missing valid "body" array');
      }
      return parsed;
    },
    { retries: 3, baseDelayMs: 2000, label: 'Blog post generation' }
  );

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

  const existing = await withRetry(
    () => client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: postData.slug }),
    { retries: 3, baseDelayMs: 1500, label: 'Sanity slug check' }
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

  const result = await withRetry(() => client.create(doc), {
    retries: 3,
    baseDelayMs: 1500,
    label: 'Sanity create document',
  });
  console.log(`✅ Published! Document ID: ${result._id}`);
}

// ─────────────────────────────────────────────
// MAIN PIPELINE
// ─────────────────────────────────────────────
async function run() {
  try {
    console.log('🚀 Starting AI Blog Pipeline...\n');

    const research = await getTrendingResearch();
    const { topic, keywords, sourceEvidence, specificityCheckPassed } = await selectTopicAndKeywords(research);

    console.log(`\n📌 Selected Topic: ${topic}`);
    console.log(`🔑 Initial Keywords: ${keywords.join(', ')}`);
    console.log(`📎 Source Evidence: ${sourceEvidence}`);
    if (!specificityCheckPassed) {
      console.warn('⚠️ NOTE: Topic did not pass specificity check after retries — flagged for manual review.\n');
    } else {
      console.log('');
    }

    const finalKeywords = await validateAndRefineKeywords(topic, keywords);

    const postData = await generatePost(topic, finalKeywords, sourceEvidence, research);
    await publishToSanity(postData);

    console.log('\n🎉 Pipeline completed successfully.');
  } catch (error) {
    console.error('❌ Pipeline failed:', error.message);
    process.exit(1);
  }
}

run();