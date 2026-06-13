import { getTrendingResearch } from './blog/research.mjs';
import { selectTopicAndKeywords, validateAndRefineKeywords } from './blog/seo.mjs';
import { generatePost } from './blog/content.mjs';
import { publishToSanity } from './blog/sanity.mjs';

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
