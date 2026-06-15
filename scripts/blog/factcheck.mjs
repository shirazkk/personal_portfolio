import { callGeminiJSON } from './utils.mjs';

/**
 * Extracts all factual claims from the post body (portable text blocks)
 * and checks each one against the research. Returns flagged claims.
 */
export async function factCheckPost(postData, research, sourceEvidence) {
  console.log('🔎 Running fact-check on generated post...');

  // Flatten portable text body to plain text for easier analysis
  const bodyText = postData.body
    .map((block) => block.children?.map((c) => c.text).join('') || '')
    .filter(Boolean)
    .join('\n\n');

  const prompt = `
You are a strict fact-checker for a developer blog post. Your job is to find any claim in the article that is NOT supported by the provided research data.

RESEARCH DATA (the ONLY allowed source of facts):
===RESEARCH START===
${sourceEvidence}

${research.slice(0, 6000)}
===RESEARCH END===

ARTICLE TO FACT-CHECK:
===ARTICLE START===
Title: ${postData.title}

${bodyText}
===ARTICLE END===

TASK:
Read every factual claim in the article — version numbers, dates, feature names, CVE numbers, benchmark figures, framework names, API names, company announcements.
For each claim, determine: is this verifiably present in the research above, OR did the AI invent/hallucinate it?

Flag ONLY claims that are:
1. Specific (a number, a name, a version, a date, a CVE, a benchmark)
2. NOT traceable to the research provided

Do NOT flag:
- General developer knowledge (e.g. "TypeScript adds static types to JavaScript")
- Obvious common facts (e.g. "React uses a virtual DOM")
- The article's own opinions or recommendations

Return ONLY a raw JSON object (no markdown, no explanation):
{
  "hasFlaggedClaims": true | false,
  "flaggedClaims": [
    {
      "claim": "the exact quote from the article",
      "issue": "why this is suspicious or unverifiable"
    }
  ],
  "overallVerdict": "clean" | "minor_issues" | "major_hallucination",
  "summary": "one sentence verdict"
}
`;

  const result = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 1500,
    label: 'Fact-check',
  });

  if (result.hasFlaggedClaims && result.flaggedClaims.length > 0) {
    console.warn(`  ⚠️ Fact-check flagged ${result.flaggedClaims.length} claim(s):`);
    result.flaggedClaims.forEach((c, i) => {
      console.warn(`     ${i + 1}. "${c.claim}"\n        → ${c.issue}`);
    });
  } else {
    console.log('  ✅ Fact-check passed — no hallucinated claims detected.');
  }

  console.log(`  📋 Verdict: ${result.overallVerdict} — ${result.summary}`);
  return result;
}

/**
 * If fact-check finds major hallucination, rewrites only the flagged sentences.
 * Returns the cleaned postData.
 */
export async function repairHallucinatedClaims(postData, factCheckResult, research, sourceEvidence) {
  if (!factCheckResult.hasFlaggedClaims || factCheckResult.overallVerdict === 'clean') {
    return postData; // Nothing to fix
  }

  console.log('🔧 Repairing hallucinated claims in post body...');

  const flaggedList = factCheckResult.flaggedClaims
    .map((c, i) => `${i + 1}. CLAIM: "${c.claim}"\n   ISSUE: ${c.issue}`)
    .join('\n\n');

  const bodyText = postData.body
    .map((block) => block.children?.map((c) => c.text).join('') || '')
    .filter(Boolean)
    .join('\n\n');

  const prompt = `
You are editing a developer blog post to remove hallucinated or unverifiable claims.

RESEARCH DATA (the ONLY allowed source of facts):
===RESEARCH START===
${sourceEvidence}

${research.slice(0, 6000)}
===RESEARCH END===

CURRENT ARTICLE BODY (plain text):
${bodyText}

FLAGGED HALLUCINATIONS TO FIX:
${flaggedList}

TASK:
For each flagged claim:
- If the claim is a made-up number/version/CVE/name: REMOVE it entirely or replace with a verifiable general statement that is true based on the research.
- If the claim is partially correct: correct it to match the research.
- Do NOT change anything that is not flagged.
- Do NOT add new claims not in the research.
- Keep the same writing voice and article flow.

Return ONLY the corrected full article body as a raw JSON array of Portable Text blocks.
Each block must follow this exact structure:
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
      "text": "corrected text here"
    }
  ]
}

Return ONLY the raw JSON array — no markdown fences, no explanation.
`;

  const repairedBody = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 2000,
    label: 'Hallucination repair',
  });

  if (Array.isArray(repairedBody) && repairedBody.length > 0) {
    console.log('  ✅ Repair complete. Replaced post body with corrected version.');
    postData.body = repairedBody;
  } else {
    console.warn('  ⚠️ Repair returned invalid body. Keeping original and flagging for manual review.');
  }

  return postData;
}
