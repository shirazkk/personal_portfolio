import { getTrendingResearch } from './blog/research.mjs';
import { selectTopicAndKeywords, validateAndRefineKeywords } from './blog/seo.mjs';
import { generatePost } from './blog/content.mjs';
import { publishToSanity, getRecentPostTitles } from './blog/sanity.mjs';
import { factCheckPost, repairHallucinatedClaims } from './blog/factcheck.mjs';
import { verifyPostQuality } from './blog/verifier.mjs';
import { rewritePost } from './blog/rewrite.mjs';
import { checkResearchSufficiency } from './blog/research-check.mjs';

// ─────────────────────────────────────────────
// MAIN PIPELINE
// ─────────────────────────────────────────────
// Agent Separation:
// - Writer Agent (content.mjs): Generates blog posts
// - Verifier Agent (verifier.mjs): Quality verification (separate prompts)
// - Rewrite Agent (rewrite.mjs): Improves content based on feedback (separate prompts)
// - Fact-Checker Agent (factcheck.mjs): Validates factual accuracy (separate prompts)
// This ensures strict separation of duties - no agent verifies its own work.
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
    const keywordList = keywords.map((k) => (typeof k === 'string' ? k : k.keyword));
    console.log(`🔑 Initial Keywords: ${keywordList.join(', ')}`);
    console.log(`📎 Source Evidence: ${sourceEvidence}`);
    console.log(`📚 Checked against ${recentTitles.length} recent posts for duplicates`);

    if (!specificityCheckPassed) {
      console.warn('⚠️  Topic did not pass specificity check — skipping publication for this week.');
      console.warn('   The research data was insufficient to support a quality blog post.');
      console.warn('   This is expected behavior when trending news lacks technical depth.');
      process.exit(0); // Exit gracefully, don't fail the workflow
    }

    // 3. Validate + refine keywords
    const finalKeywords = await validateAndRefineKeywords(topic, keywords);

    // 4. Check research sufficiency
    const researchCheck = await checkResearchSufficiency(topic, research, sourceEvidence);

    // 5. Generate article
    let postData = await generatePost(topic, finalKeywords, sourceEvidence, research, researchCheck);

    // 6. Fact-check the generated article against the research
    const factCheckResult = await factCheckPost(postData, research, sourceEvidence);

    // 7. If major hallucination found → attempt repair before publishing
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

    // 8. Quality verification with rewrite loop
    const maxRewrites = 3;
    let currentRewrite = 0;
    let qualityResult = await verifyPostQuality(postData, topic, finalKeywords);

    // Skip rewrite loop if hallucinated versions detected (critical issue)
    if (qualityResult.hasHallucinatedVersions) {
      console.error(`❌ Critical failure: Hallucinated version numbers detected.`);
      console.error(`   This indicates insufficient research data for a concrete implementation guide.`);
      console.error(`   Consider choosing a different topic with more available technical details.`);
      process.exit(1);
    }

    while (!qualityResult.passed && currentRewrite < maxRewrites) {
      currentRewrite++;
      console.log(`\n🔄 Rewrite attempt ${currentRewrite}/${maxRewrites}...`);
      console.log(`   Feedback: ${qualityResult.rewriteFeedback}`);

      postData = await rewritePost(postData, qualityResult.rewriteFeedback, topic, finalKeywords, research, sourceEvidence, researchCheck);

      // Re-verify after rewrite
      qualityResult = await verifyPostQuality(postData, topic, finalKeywords);

      // Check again for hallucinated versions after rewrite
      if (qualityResult.hasHallucinatedVersions) {
        console.error(`❌ Rewrite ${currentRewrite} still contains hallucinated versions. Aborting.`);
        process.exit(1);
      }
    }

    if (!qualityResult.passed) {
      console.error(`❌ Post failed quality verification after ${maxRewrites} rewrite attempts.`);
      console.error(`   Final score: ${qualityResult.overallScore}/10`);
      console.error(`   Weaknesses: ${qualityResult.weaknesses.join(', ')}`);
      process.exit(1);
    }

    console.log(`\n✅ Quality verification passed with score: ${qualityResult.overallScore}/10`);

    // 9. Publish
    await publishToSanity(postData);

    console.log('\n🎉 Pipeline completed successfully.');
  } catch (error) {
    console.error('❌ Pipeline failed:', error.message);
    process.exit(1);
  }
}

run();
