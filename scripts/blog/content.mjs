import { withRetry, getCurrentMonthYear } from './utils.mjs';
import { callGeminiJSON, model } from './utils.mjs'; // Need to export model in utils or move model init
import { nanoid } from 'nanoid';

// Note: I will need to move model initialization to utils or a shared module
export async function generatePost(topic, keywords, sourceEvidence, research) {
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
