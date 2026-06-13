import { createClient } from '@sanity/client';
import { sanityConfig } from './config.mjs';
import { withRetry } from './utils.mjs';

const client = createClient(sanityConfig);

export async function publishToSanity(postData) {
  console.log(`📤 Publishing: ${postData.title}`);

  const existing = await withRetry(
    () => client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: postData.slug }),
    { retries: 3, baseDelayMs: 1500, label: 'Sanity slug check' }
  );

  if (existing) {
    console.log('⚠️ Post with this slug already exists. Skipping...');
    return;
  }

  const doc = {
    _type: 'post',
    title: postData.title,
    slug: { _type: 'slug', current: postData.slug },
    excerpt: postData.excerpt,
    metaTitle: postData.metaTitle,
    metaDescription: postData.metaDescription,
    date: new Date().toISOString(),
    readTime: postData.readTime,
    category: postData.category,
    heroLabel: postData.heroLabel,
    tags: postData.tags,
    body: postData.body,
  };

  const result = await withRetry(() => client.create(doc), {
    retries: 3,
    baseDelayMs: 1500,
    label: 'Sanity create document',
  });
  console.log(`✅ Published! Document ID: ${result._id}`);
}
