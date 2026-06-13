import { callGeminiJSON } from './utils.mjs';
import googleTrends from 'google-trends-api';
import { withRetry } from './utils.mjs';
import { searchSerperOrganic } from './research.mjs'; // Need to export this from research.mjs

export async function generateTopicCandidate(research, label, feedback = null) {
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

export async function checkTopicSpecificity(candidate) {
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

export async function selectTopicAndKeywords(research) {
  console.log('🎯 Selecting specific, news-tied topic and SEO keywords...');
  const { getCurrentMonthYear } = await import('./utils.mjs');
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

export async function getTrendForKeyword(keyword) {
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

export async function getRelatedSearches(keyword) {
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

export async function refineKeywords(originalKeywords, trendData, relatedCandidates, topic) {
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

export async function validateAndRefineKeywords(topic, keywords) {
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
