import { withRetry, getCurrentMonthYear } from './utils.mjs';
import { callGeminiJSON, model } from './utils.mjs';
import { nanoid } from 'nanoid';

export async function generatePost(topic, keywords, sourceEvidence, research, researchCheck = null) {
  console.log(`✍️ Writing blog post on: ${topic}`);

  const { label } = getCurrentMonthYear();
  const keywordList = keywords.map((k) => (typeof k === 'string' ? k : k.keyword));

  // Add research guidance if available
  const researchGuidance = researchCheck
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEARCH SUFFICIENCY GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Article Type: ${researchCheck.articleType}
Available Details: ${researchCheck.availableDetails.join(', ')}
Missing Details: ${researchCheck.missingDetails.join(', ')}
Writing Guidance: ${researchCheck.writingGuidance}

${researchCheck.articleType === 'conceptual_exploration'
    ? 'CRITICAL: Since this is a CONCEPTUAL article, focus on architecture, approach, and high-level implementation patterns. Do NOT invent specific version numbers, API names, or code examples that are not in the research. Write about the CONCEPT and HOW TO THINK about the problem, not fake implementation details. NEVER mention version numbers for Next.js, TypeScript, React, etc. unless they are explicitly in the research.'
    : 'Write a concrete implementation guide using the specific technical details available in the research.'}
`
    : '';

  const prompt = `
You are Shiraz Abubakar — a Full Stack & Agentic AI Developer based in Karachi, Pakistan.
You write developer-focused blog posts that rank on Google AND genuinely teach developers something useful.

CURRENT DATE: ${label}
TOPIC: ${topic}

${researchGuidance}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESEARCH — YOUR ONLY ALLOWED SOURCE OF FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Everything factual in this article MUST come from the research below.
If a fact, version number, CVE, feature name, benchmark, or claim is NOT in this research — do NOT write it.
If you are unsure whether something is in the research — leave it out.

SOURCE EVIDENCE (why this topic is timely):
${sourceEvidence}

FULL RESEARCH DATA:
${research.slice(0, 6000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO KEYWORDS — USE NATURALLY, NEVER FORCE THEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${keywordList.map((k, i) => `${i + 1}. ${k}`).join('\n')}

Primary keyword must appear in: title, first paragraph, at least 2 H2 headings, conclusion.
Secondary keywords woven naturally throughout. Never repeat the same phrase awkwardly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WRITING RULES — NON-NEGOTIABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOICE & TONE:
- Write as a real developer talking to another developer. Casual but precise.
- Use "I", "you", "we" naturally. Share a quick opinion or war story where it fits.
- Short punchy sentences next to longer explanations — vary your rhythm.
- Never use these filler phrases: "In today's fast-paced world", "It is worth noting", "It goes without saying", "As we all know", "cannot be overstated", "monumental milestone", "strategic consolidation", "force multiplier", "boon for developers". These are AI tells. Replace with direct, specific statements.
- No vague conclusions like "the future is exciting." Say something concrete.

WHAT EVERY SECTION MUST DO:
- Teach something specific and actionable. Ask: "Would a developer learn something NEW reading this section?"
- Every claim that sounds like a fact needs to be traceable to the research above.
- Use real examples: a concrete config change, an actual CLI command, a real breaking change from the research — not hypothetical "imagine you have a large codebase" padding.
- Blockquotes are for genuine insights or key takeaways, not restatements of the section heading.
- Include specific version numbers, API names, file paths, or exact syntax from the research.
- Add quantitative details where available (benchmarks, performance metrics, specific improvements).

WHAT TO NEVER DO:
- Never invent CVE numbers, benchmark numbers, version dates, or feature names not found in the research.
- NEVER use version numbers for software/tools not explicitly mentioned in the research (e.g., if research says "Next.js" but doesn't specify a version, NEVER invent "Next.js 16.2").
- Never invent technical specifications, API names, or capabilities not in the research.
- Never write "as an agentic AI developer based in Karachi" — this is cringe and kills credibility.
- Never use a blockquote to say something you already said in the paragraph above it.
- Never pad paragraphs with synonyms of words you already used just to hit word count.
- Never end a section with a teaser for the next section ("In the next section, we will explore...").
- If the research lacks specific technical details, write a CONCEPTUAL article about the approach/exploration rather than inventing fake implementation details.

STRUCTURE:
- Title: Specific, names the exact tool/version, includes primary keyword. No clickbait.
- Intro (150–200 words): Start with the concrete problem or the specific news event. Tell the reader exactly what they will learn. No philosophical warm-up. MUST include primary keyword naturally.
- 5–7 H2 sections. Each section:
    - Has a descriptive heading that targets a real search query (e.g. "How to migrate from ES5 target in TypeScript 6.0" not "Understanding TypeScript 6.0")
    - Heading should include secondary keywords where natural
    - Contains 2–3 paragraphs (80–120 words each)
    - Has at least one concrete example (command, config snippet, real API name, real file path — whatever fits)
    - Has 1 blockquote that is a genuine takeaway, not a restatement
- Conclusion (100–150 words): Summarize 2–3 concrete things the reader now knows. One CTA sentence at the end. MUST include primary keyword.
- Minimum 1500 words total.

SEO REQUIREMENTS:
- Primary keyword MUST appear in: title, first paragraph, at least 2 H2 headings, conclusion
- Secondary keywords should be woven naturally throughout H2 headings and body text
- Never force keywords - if it doesn't fit naturally, don't include it
- Use semantic HTML structure: H1 (title) → H2 (sections) → H3 (subsections if needed)
- Include related long-tail keyword phrases in the content naturally

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY a raw JSON object — no markdown fences, no explanation, nothing before or after the JSON.

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

  const postData = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 2000,
    label: 'Blog post generation',
  });

  if (!Array.isArray(postData.body) || postData.body.length === 0) {
    throw new Error('response missing valid "body" array');
  }

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