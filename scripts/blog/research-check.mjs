import { callGeminiJSON } from './utils.mjs';

/**
 * Checks if the research contains sufficient technical details
 * for writing a concrete implementation guide.
 * If not, suggests writing a conceptual article instead.
 */
export async function checkResearchSufficiency(topic, research, sourceEvidence) {
  console.log('🔍 Checking research sufficiency for technical depth...');

  const prompt = `
You are evaluating whether research data contains sufficient technical details to write a concrete implementation guide.

TOPIC: "${topic}"
SOURCE EVIDENCE: "${sourceEvidence}"

RESEARCH DATA:
${research.slice(0, 8000)}

TASK:
Determine if this research contains enough specific technical information to write a CONCRETE implementation guide with:
- Real API names/parameters
- Actual file formats/configs
- Specific version numbers
- Concrete code examples

OR if it only has high-level information suitable for a CONCEPTUAL article about:
- General approach/architecture
- Industry trends
- High-level benefits/challenges

CRITICAL: For conceptual articles, NEVER suggest using specific version numbers for software/tools not mentioned in the research. Do not mention "Next.js 16.2" or "TypeScript 7" if they're not in the research.

Answer with ONLY a raw JSON object (no markdown, no explanation):
{
  "sufficientForConcrete": true | false,
  "articleType": "concrete_implementation" | "conceptual_exploration",
  "availableDetails": ["list what specific technical details ARE available"],
  "missingDetails": ["list what specific technical details are MISSING"],
  "writingGuidance": "specific guidance on how to approach writing given the available information. For conceptual articles, focus on architecture, benefits, and approach without inventing version numbers or technical specifics."
}
`;

  const result = await callGeminiJSON(prompt, {
    retries: 3,
    baseDelayMs: 1500,
    label: 'Research sufficiency check',
  });

  console.log(`  📊 Article Type: ${result.articleType}`);
  console.log(`  ✅ Sufficient for concrete guide: ${result.sufficientForConcrete}`);

  if (!result.sufficientForConcrete) {
    console.log(`  📝 Writing Guidance: ${result.writingGuidance}`);
  }

  return result;
}
