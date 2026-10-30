import { callGeminiJSON } from './utils.mjs';

/**
 * Verifies blog post quality and provides detailed feedback for rewriting.
 * Scores posts on 10-point scale across multiple dimensions.
 * Enforces separation of duties by using a distinct verification prompt and logic.
 */
export async function verifyPostQuality(postData, topic, keywords) {
  console.log('🔍 Running quality verification...');

  const bodyText = postData.body
    .map((block) => block.children?.map((c) => c.text).join('') || '')
    .filter(Boolean)
    .join('\n\n');

  const keywordList = keywords.map((k) => (typeof k === 'string' ? k : k.keyword));

  const prompt = `
You are a strict quality verifier for a developer blog post. Your job is to evaluate the article on multiple dimensions and provide specific feedback for improvement.

TOPIC: ${topic}
TARGET KEYWORDS: ${keywordList.join(', ')}

ARTICLE TO VERIFY:
Title: ${postData.title}
Excerpt: ${postData.excerpt}

${bodyText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVALUATION DIMENSIONS (Score 1-10 each)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SPECIFICITY & CONCRETE VALUE (1-10):
   - Does the article teach something specific and actionable?
   - Are there real examples (commands, configs, API names, code snippets)?
   - Or is it vague filler that could apply to any topic?

2. SEO OPTIMIZATION (1-10):
   - Primary keyword in title, first paragraph, at least 2 H2s, conclusion?
   - Keywords used naturally, not forced?
   - Proper heading structure (H2s targeting real search queries)?

3. TECHNICAL ACCURACY (1-10):
   - Are technical claims precise and credible?
   - No invented version numbers, CVEs, or benchmarks?
   - No obvious technical errors?
   - CRITICAL: If version numbers are used for software not in research, score 0-2 here.

4. WRITING QUALITY (1-10):
   - Natural developer voice, not AI-generated filler?
   - No cringe phrases like "In today's fast-paced world", "cannot be overstated", etc.?
   - Good rhythm and sentence variety?

5. DEPTH & RESEARCH (1-10):
   - Does it show evidence of research beyond surface-level?
   - Are there specific details that indicate actual expertise?
   - Or is it generic content that could be written without research?

6. HALLUCINATION CHECK (Pass/Fail):
   - Does the article contain version numbers for software/tools not mentioned in the research?
   - Are there invented technical specifications, API names, or capabilities?
   - If yes, this is a critical failure that must be flagged.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCORING THRESHOLDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- PASS: Overall score 8.0+ AND no individual dimension below 6 AND hasHallucinatedVersions = false
- FAIL: Overall score below 8.0 OR any dimension below 6 OR hasHallucinatedVersions = true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a raw JSON object (no markdown, no explanation):
{
  "overallScore": 8.5,
  "passed": true,
  "dimensionScores": {
    "specificity": 8,
    "seo": 9,
    "technicalAccuracy": 8,
    "writingQuality": 7,
    "depth": 9
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "rewriteFeedback": "Specific, actionable feedback for rewriting. Focus on the weakest dimensions. Be concrete about what needs to change.",
  "shouldRewrite": true,
  "hasHallucinatedVersions": true | false
}
`;

  const result = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 1500,
    label: 'Quality verification',
  });

  console.log(`  📊 Overall Score: ${result.overallScore}/10`);
  console.log(`  ✅ Passed: ${result.passed}`);
  console.log(`  📈 Dimension Scores:`);
  console.log(`     Specificity: ${result.dimensionScores.specificity}/10`);
  console.log(`     SEO: ${result.dimensionScores.seo}/10`);
  console.log(`     Technical Accuracy: ${result.dimensionScores.technicalAccuracy}/10`);
  console.log(`     Writing Quality: ${result.dimensionScores.writingQuality}/10`);
  console.log(`     Depth: ${result.dimensionScores.depth}/10`);
  console.log(`  🔍 Hallucinated Versions: ${result.hasHallucinatedVersions ? 'YES - CRITICAL' : 'No'}`);

  if (result.weaknesses && result.weaknesses.length > 0) {
    console.log(`  ⚠️ Weaknesses: ${result.weaknesses.join(', ')}`);
  }

  // Auto-fail if hallucinated versions detected
  if (result.hasHallucinatedVersions) {
    result.passed = false;
    console.log(`  ❌ AUTO-FAIL: Hallucinated version numbers detected`);
  }

  return result;
}