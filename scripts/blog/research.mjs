import { serperApiKey } from './config.mjs';
import { withRetry, daysAgoTimestamp } from './utils.mjs';

async function searchSerperNews(query) {
  return withRetry(
    async () => {
      const response = await fetch('https://google.serper.dev/news', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 10 }),
      });

      if (!response.ok) throw new Error(`Serper news error: ${response.statusText}`);
      const data = await response.json();

      if (!data.news || data.news.length === 0) return '(no results)';

      return data.news
        .map(
          (item) =>
            `TITLE: ${item.title}\nSNIPPET: ${item.snippet || ''}\nDATE: ${item.date || 'unknown'}\nSOURCE: ${item.source || ''}\nURL: ${item.link}`
        )
        .join('\n---\n');
    },
    { retries: 3, baseDelayMs: 1000, label: `Serper news "${query}"` }
  );
}

// Export this for seo.mjs
export async function searchSerperOrganic(query) {
  return withRetry(
    async () => {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 10 }),
      });

      if (!response.ok) throw new Error(`Serper search error: ${response.statusText}`);
      return response.json();
    },
    { retries: 3, baseDelayMs: 1000, label: `Serper search "${query}"` }
  );
}

async function searchHNAlgolia(query) {
  return withRetry(
    async () => {
      const sevenDaysAgo = daysAgoTimestamp(7);
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
        query
      )}&tags=story&numericFilters=created_at_i>${sevenDaysAgo}&hitsPerPage=10`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HN Algolia error: ${response.statusText}`);
      const data = await response.json();

      if (!data.hits || data.hits.length === 0) return '(no results)';

      return data.hits
        .map((hit) => {
          const date = new Date(hit.created_at).toISOString().split('T')[0];
          return `TITLE: ${hit.title}\nPOINTS: ${hit.points || 0}\nCOMMENTS: ${hit.num_comments || 0}\nDATE: ${date}\nURL: ${hit.url || `https://news.ycombinator.com/item?id=${hit.story_id}`}`;
        })
        .join('\n---\n');
    },
    { retries: 3, baseDelayMs: 1000, label: `HN Algolia "${query}"` }
  );
}

export async function getTrendingResearch() {
  console.log('🔍 Running dynamic, date-anchored trend research...');
  const { getCurrentMonthYear } = await import('./utils.mjs');
  const { label } = getCurrentMonthYear();

  const newsQueries = [
    `AI model release ${label}`,
    `new AI agent framework ${label}`,
    `Next.js TypeScript update ${label}`,
    `developer tools launch this week AI`,
    `agentic AI news ${label}`,
  ];

  const hnQueries = ['AI agent', 'LLM', 'Next.js', 'TypeScript', 'AI framework'];

  console.log(`  📅 Anchoring queries to: ${label}`);

  // Optimized with flat Promise.all
  const results = await Promise.all([
    ...newsQueries.map(async (q) => ({ type: 'news', query: q, result: await searchSerperNews(q).catch(e => `(error: ${e.message})`) })),
    ...hnQueries.map(async (q) => ({ type: 'hn', query: q, result: await searchHNAlgolia(q).catch(e => `(error: ${e.message})`) }))
  ]);

  const newsSection = results
    .filter(r => r.type === 'news')
    .map((r) => `=== NEWS (${label}): "${r.query}" ===\n${r.result}`)
    .join('\n\n');

  const hnSection = results
    .filter(r => r.type === 'hn')
    .map((r) => `=== HACKER NEWS (last 7 days): "${r.query}" ===\n${r.result}`)
    .join('\n\n');

  return `${newsSection}\n\n${hnSection}`;
}
