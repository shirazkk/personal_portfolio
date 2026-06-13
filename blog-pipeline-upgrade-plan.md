# AI Blog Pipeline Upgrade Plan

## Problem Summary
Current pipeline produces generic, evergreen-sounding blog titles (e.g. "The Agentic Full-Stack Developer in 2026") instead of topics tied to specific, recent AI/dev news. Root causes:

1. **Hardcoded, static search queries** — same 4 queries every run, none time-anchored, none news-typed. They return broad "best practices" / "trending tools" content rather than dated events.
2. **Topic-selection prompt has no concept of "new"** — it asks Gemini to "pick the most trending topic" but doesn't require the topic to be tied to a specific named release, tool, or event. So Gemini defaults to safe, generic titles it could generate without any research at all.
3. **No company-agnostic discovery** — relying on fixed sources (e.g. RSS) would only catch news from companies you remember to add, missing surprise releases from anyone else.

## Solution Overview
Replace static research with **dynamic, date-anchored, news-typed search queries** (company-agnostic), combined with a **developer-community signal** (HN), and enforce topic specificity through a **strict prompt + self-check regeneration pass**.

---

## Step 1: Dynamic Research Layer (replaces `getTrendingResearch`)

### 1a. Date-anchored Serper News queries
- Inject current month/year at runtime (e.g. `new Date()` → "June 2026").
- Use Serper's `type: "news"` parameter (instead of default `"search"`) so results are recent, dated articles — not evergreen pages.
- Query templates (company-agnostic, broad enough to catch any AI/dev player):
  - `"AI model release {month} {year}"`
  - `"new AI agent framework {month} {year}"`
  - `"Next.js TypeScript update {month} {year}"`
  - `"developer tools launch this week AI"`
  - `"agentic AI news {month} {year}"`
- Each query run with `type: "news"`, results limited to ~10, sorted by recency (Serper News results include dates — keep these dates in the extracted text so Gemini can reason about "how recent").

### 1b. Hacker News Algolia signal
- Free, no auth: `https://hn.algolia.com/api/v1/search_by_date`
- Query terms: `"AI"`, `"agent"`, `"LLM"`, `"Next.js"`, `"TypeScript"` — sorted by date, last 7 days only (use `numericFilters=created_at_i>{timestamp_7_days_ago}`).
- Extract: story title, points, comment count, URL, date.
- Purpose: signals what developers are actively discussing — good for validating "is this actually buzzy" vs. just "is this in the news."

### Output of Step 1
A combined research string with clearly labeled, dated sections:
```
=== NEWS (June 2026): "AI model release June 2026" ===
[dated articles...]

=== NEWS (June 2026): "new AI agent framework June 2026" ===
[dated articles...]

=== HACKER NEWS (last 7 days, sorted by date) ===
[title | points | comments | date | url]
...
```

---

## Step 2: Strict Topic Selection (replaces `selectTopicAndKeywords`)

### 2a. Strict prompt requirements
The prompt will explicitly require:
- The topic MUST reference a **specific named tool, model, framework, version number, or event** found in the research (e.g. "Claude Opus 4.6", "Next.js 15.4", "LangGraph v0.3 memory API" — not "AI agents in general").
- Reject topic candidates that are timeless/generic — i.e., titles that "could have been written without today's research."
- Output includes a `sourceEvidence` field: a short quote/reference from the research justifying why this topic is "new" (this becomes the self-check anchor in Step 2b).
- Still relevant to: Next.js, TypeScript, Agentic AI, AI Automation, Full Stack Development — but the *hook* must be the new thing, with the dev-stack angle as the application/tie-in.

### 2b. Self-check / regeneration pass
A second Gemini call (or same call restructured as 2-step):
- Input: the candidate `{topic, keywords, sourceEvidence}`.
- Prompt: "Could this topic title have been written without the source evidence below? Answer YES or NO. If YES, this topic is too generic — regenerate a more specific topic that explicitly hooks into the named tool/release/event in the evidence."
- If self-check returns YES (generic) → re-run topic selection with feedback, max 2 retries.
- If retries exhausted → fall back to most-specific candidate found, flagged in logs for manual review (don't crash the pipeline).

### Output of Step 2
```json
{
  "topic": "...",
  "keywords": [...],
  "sourceEvidence": "...",
  "specificityCheckPassed": true
}
```

---

## Step 2c: SEO Keyword Validation (NEW)

### Purpose
Even after Step 2 produces specific, news-tied keywords, there's no guarantee those exact phrases have real search demand. This step validates and refines the keyword list using free signals before finalizing.

### 2c-i. Google Trends relative interest
- Use the `google-trends-api` npm package (free, unofficial — wraps Google Trends).
- For each candidate keyword, fetch interest-over-time for the last 30 days.
- Classify each keyword as **rising**, **flat**, or **declining/zero**.
- Drop or deprioritize "declining/zero" keywords; flag "rising" keywords as priority for placement in title/H2s.

### 2c-ii. Serper "Related Searches" & "People Also Ask"
- For the top 1-2 primary keywords, run one Serper organic search call (`type: "search"`, default) per keyword.
- Extract `relatedSearches` and `peopleAlsoAsk` arrays from the response (already included in Serper's standard response, no extra cost).
- These surface real long-tail variants people are actually typing — feed these back as candidate additional keywords.

### 2c-iii. Keyword refinement pass
- Combine: original keywords (Step 2) + Trends classification + related searches/PAA results.
- One Gemini call: "Given these candidates and their Trends signal, select the final 5-8 keywords — prioritize 'rising' terms and incorporate relevant related-search phrases. Drop any 'declining/zero' terms unless no alternative exists."
- Output: final validated keyword list, each tagged with its Trends status for logging/QA.

### Output of Step 2c
```json
{
  "finalKeywords": [
    {"keyword": "...", "trend": "rising"},
    {"keyword": "...", "trend": "flat"},
    ...
  ]
}
```
This final list replaces `keywords` going into Step 3.

### Risks / Notes
- `google-trends-api` is unofficial and can occasionally fail/rate-limit — wrap in try/catch; on failure, skip Trends classification and proceed with Step 2 keywords unchanged (don't block the pipeline).
- Adds ~2-3 extra API calls per run (Trends x N keywords + 1-2 Serper related-search calls + 1 Gemini refinement call) — still well within free tiers for a daily/weekly run cadence.

---

## Step 3: Blog Generation (`generatePost`) — minor updates
- No structural change to Portable Text output.
- Add `sourceEvidence` and current date into the prompt context so Gemini's intro paragraph can naturally reference "as of {month year}, X just shipped Y" — reinforcing freshness/SEO recency signals (Google rewards dated, specific content).
- Otherwise unchanged.

---

## Step 4: Publish to Sanity — unchanged
No changes needed; existing duplicate-slug check and document creation logic remains.

---

## New/Changed Functions Summary

| Function | Change |
|---|---|
| `searchSerperNews(query)` | NEW — calls Serper with `type: "news"`, extracts title/snippet/date/url |
| `searchHNAlgolia(query)` | NEW — free HN Algolia API, last 7 days, sorted by date |
| `getTrendingResearch()` | REWRITTEN — dynamic date-injected queries, combines news + HN, labeled output |
| `selectTopicAndKeywords()` | REWRITTEN — strict prompt requiring named entity + sourceEvidence |
| `checkTopicSpecificity()` | NEW — self-check pass, retry loop (max 2) |
| `validateKeywordsWithTrends()` | NEW — Google Trends interest classification (rising/flat/declining) per keyword |
| `getRelatedSearches()` | NEW — Serper organic call, extracts relatedSearches + peopleAlsoAsk |
| `refineKeywords()` | NEW — Gemini call combining Trends data + related searches into final keyword list |
| `generatePost()` | MINOR EDIT — inject sourceEvidence + current date + final validated keywords into prompt |
| `publishToSanity()` | UNCHANGED |

---

## Dependencies / Setup Notes
- No new API keys required — Serper News uses the same `SERPER_API_KEY`, just with `type: "news"` in the request body.
- HN Algolia requires no key.
- Add a small date utility to get current month/year strings for query injection.

## Risks / Edge Cases
- Serper News may return fewer/no results for very niche queries — fallback to broader query if a news query returns empty.
- Self-check retry loop must have a hard cap (2 retries) to avoid runaway API costs.
- If all retries fail, pipeline should still produce a post (best available candidate) rather than exit — log a warning for manual review instead of `process.exit(1)`.

---

## Next Step
Once approved, implement in this order: (1) new search functions (Serper News, HN Algolia), (2) rewritten research aggregator, (3) rewritten topic selection + self-check, (4) keyword validation (Trends + related searches + refinement), (5) generatePost prompt tweaks, (6) test end-to-end run.
