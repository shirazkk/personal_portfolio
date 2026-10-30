import { callGeminiJSON } from './utils.mjs';
import { nanoid } from 'nanoid';

/**
 * Rewrites a blog post based on specific verifier feedback.
 * Enforces separation of duties by using a distinct rewrite prompt focused on improvement.
 */
export async function rewritePost(postData, feedback, topic, keywords, research, sourceEvidence, researchCheck = null) {
  console.log('🔄 Rewriting post based on verifier feedback...');

  const bodyText = postData.body
    .map((block) => block.children?.map((c) => c.text).join('') || '')
    .filter(Boolean)
    .join('\n\n');

  const keywordList = keywords.map((k) => (typeof k === 'string' ? k : k.keyword));

  // Add research guidance if available
  const researchGuidance = researchCheck
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEARCH SUFFICIENCY GUIDANCE (REWRITE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Article Type: ${researchCheck.articleType}
Available Details: ${researchCheck.availableDetails.join(', ')}
Missing Details: ${researchCheck.missingDetails.join(', ')}

${researchCheck.articleType === 'conceptual_exploration'
    ? 'REMEMBER: This is a CONCEPTUAL article. Do NOT invent specific version numbers, API names, or code examples. Focus on architecture and approach, not fake implementation details. NEVER mention version numbers for Next.js, TypeScript, React, etc. unless they are explicitly in the research.'
    : 'Use the specific technical details available in the research for concrete implementation guidance.'}
`
    : '';

  const prompt = `
You are improving a developer blog post based on specific quality feedback. Your job is to rewrite the article to address the weaknesses while preserving its strengths.

TOPIC: ${topic}
KEYWORDS: ${keywordList.join(', ')}

${researchGuidance}

FEEDBACK TO ADDRESS:
${feedback}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT ARTICLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: ${postData.title}
Excerpt: ${postData.excerpt}

${bodyText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEARCH DATA (for accuracy and specifics)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOURCE EVIDENCE: ${sourceEvidence}

${research.slice(0, 6000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REWRITE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ADDRESS THE FEEDBACK DIRECTLY:
   - If feedback says "add concrete examples": Add real commands, configs, API names, code snippets
   - If feedback says "improve SEO": Ensure primary keyword in title, first paragraph, 2+ H2s, conclusion
   - If feedback says "remove AI filler": Eliminate phrases like "In today's fast-paced world", "cannot be overstated"
   - If feedback says "add depth": Include specific technical details, version numbers, benchmarks from research

2. PRESERVE WHAT WORKS:
   - Keep the core structure and valuable sections
   - Maintain the specific examples that are good
   - Don't change things that aren't mentioned in the feedback

3. MAINTAIN WRITING STANDARDS:
   - Developer voice: casual but precise
   - Use "I", "you", "we" naturally
   - Short punchy sentences mixed with longer explanations
   - No vague conclusions

4. FACTUAL ACCURACY:
   - Every factual claim must be traceable to the research
   - Don't invent version numbers, CVEs, benchmarks not in research
   - NEVER use version numbers for software/tools not explicitly mentioned in the research
   - When in doubt, leave it out or make it general
   - If research lacks specific technical details, write conceptually rather than inventing fake specifics

5. STRUCTURE:
   - Title: Specific, names exact tool/release, includes primary keyword
   - Intro (150-200 words): Concrete problem or news event, what they'll learn
   - 5-7 H2 sections: Descriptive headings, 2-3 paragraphs each, concrete examples, blockquote takeaways
   - Conclusion (100-150 words): 2-3 concrete things learned, one CTA
   - Minimum 1500 words total

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a raw JSON object — no markdown fences, no explanation.

Every block in "body" MUST follow this Portable Text structure:
{
  "_type": "block",
  "_key": "unique_8char_string",
  "style": "normal" | "h2" | "h3" | "blockquote",
  "markDefs": [],
  "children": [
    {
      "_type": "span",
      "_key": "unique_8char_string",
      "marks": [],
      "text": "your text here"
    }
  ]
}

JSON shape:
{
  "title": "Specific SEO title naming the exact tool/release",
  "slug": "url-friendly-slug",
  "excerpt": "2 sentences. Specific, includes primary keyword, tells the reader what they will learn.",
  "metaTitle": "Under 60 chars. Primary keyword near the front.",
  "metaDescription": "Under 155 chars. Primary keyword, concrete benefit, no fluff.",
  "category": "one of: Agentic AI | AI Products | Full Stack | Web Engineering",
  "heroLabel": "3–5 word punchy phrase (e.g. 'Break less. Ship faster.')",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "readTime": "X min read",
  "body": [ ...portable text blocks... ]
}
`;

  const rewrittenPost = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 2000,
    label: 'Post rewrite',
  });

  if (!Array.isArray(rewrittenPost.body) || rewrittenPost.body.length === 0) {
    throw new Error('rewrite response missing valid "body" array');
  }

  // Ensure every block has a valid _key
  rewrittenPost.body = rewrittenPost.body.map((block) => ({
    ...block,
    _key: block._key || nanoid(),
    children: block.children?.map((child) => ({
      ...child,
      _key: child._key || nanoid(),
    })),
  }));

  console.log('  ✅ Rewrite complete.');
  return rewrittenPost;
}