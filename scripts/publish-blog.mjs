import { getTrendingResearch } from './blog/research.mjs';
import { selectTopicAndKeywords, validateAndRefineKeywords } from './blog/seo.mjs';
import { generatePost } from './blog/content.mjs';
import { publishToSanity, getRecentPostTitles } from './blog/sanity.mjs';
import { factCheckPost, repairHallucinatedClaims } from './blog/factcheck.mjs';

// ─────────────────────────────────────────────
// MAIN PIPELINE
// ─────────────────────────────────────────────
async function run() {
  try {
    console.log('🚀 Starting AI Blog Pipeline...\n');

    // 1. Gather context
    const recentTitles = await getRecentPostTitles(10);
    const research = await getTrendingResearch();

    // 2. Pick topic + keywords
    const { topic, keywords, sourceEvidence, specificityCheckPassed } =
      await selectTopicAndKeywords(research, recentTitles);

    console.log(`\n📌 Selected Topic: ${topic}`);
    console.log(`🔑 Initial Keywords: ${keywords.join(', ')}`);
    console.log(`📎 Source Evidence: ${sourceEvidence}`);

    if (!specificityCheckPassed) {
      console.warn('⚠️  Topic did not pass specificity check — flagged for review.\n');
    }

    // 3. Validate + refine keywords
    const finalKeywords = await validateAndRefineKeywords(topic, keywords);

    // 4. Generate article
    let postData = await generatePost(topic, finalKeywords, sourceEvidence, research);

    // 5. Fact-check the generated article against the research
    const factCheckResult = await factCheckPost(postData, research, sourceEvidence);

    // 6. If major hallucination found → attempt repair before publishing
    if (factCheckResult.overallVerdict === 'major_hallucination') {
      console.warn('\n🚨 Major hallucination detected. Attempting repair before publish...');
      postData = await repairHallucinatedClaims(postData, factCheckResult, research, sourceEvidence);

      // Second fact-check after repair
      const secondCheck = await factCheckPost(postData, research, sourceEvidence);
      if (secondCheck.overallVerdict === 'major_hallucination') {
        console.error('❌ Post still has major hallucinations after repair. Aborting publish.');
        console.error('   Flagged claims:', JSON.stringify(secondCheck.flaggedClaims, null, 2));
        process.exit(1);
      }
    }

    // 7. Publish
    await publishToSanity(postData);

    console.log('\n🎉 Pipeline completed successfully.');
  } catch (error) {
    console.error('❌ Pipeline failed:', error.message);
    process.exit(1);
  }
}

run();
