# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` — Start Next.js dev server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run publish-blog` — Run the AI blog pipeline script locally

## High-Level Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router), React 19.2.4, TypeScript 5
- **Styling:** Tailwind CSS 4 (PostCSS plugin, `@tailwindcss/postcss`)
- **Animations:** GSAP + ScrollTrigger + Lenis (smooth scroll)
- **3D:** Three.js, @react-three/fiber 9, @react-three/drei 10
- **CMS:** Sanity CMS 5 (blog content), embedded Studio at `/studio`
- **Fonts:** Bebas Neue (headings via `--font-bebas`), Manrope (body via `--font-manrope`)
- **Deployment:** Vercel

### Project Layout
```
app/                          # Next.js App Router pages
  layout.tsx                  # Root layout — fonts, metadata, LenisProvider
  page.tsx                    # Home page — all sections in order
  globals.css                 # Tailwind v4 imports, CSS utilities, Lenis styles
  sitemap.ts                  # Dynamic sitemap (/, /blog)
  blog/                       # Blog listing + [slug] individual post pages
  studio/[[...tool]]/         # Embedded Sanity Studio
components/                   # Section components (Hero, About, Skills, Projects, etc.)
providers/                    # LenisProvider (GSAP + Lenis scroll integration)
lib/                          # animations.ts — GSAP helpers (revealText, fadeInSlideUp, staggerCards)
data/                         # portfolio.ts — all static content (personal info, projects, experience, certs, etc.)
sanity/                       # Sanity CMS config
  env.ts                      # projectId, dataset, apiVersion env vars
  lib/client.ts               # next-sanity client
  lib/queries.ts              # GROQ queries (POSTS_QUERY, POST_QUERY, SLUGS_QUERY)
  lib/live.ts                 # Sanity Live content API
  lib/image.ts                # Image URL builder
  schemaTypes/schema.ts       # Post schema definition
  structure.ts                # Studio structure config
scripts/                      # AI blog pipeline (Node.js ESM)
  publish-blog.mjs            # Entry point — orchestrates pipeline
  blog/
    config.mjs                # API keys, Gemini model config
    research.mjs              # Serper News + HN Algolia trend research
    seo.mjs                   # Topic selection, specificity check, keyword validation
    content.mjs               # Blog post generation (Gemini → Portable Text)
    sanity.mjs                # Sanity publish with retry + slug dedup
    utils.mjs                 # Retry helper, date utils, Gemini JSON wrapper
.github/workflows/            # publish-blog.yml (scheduled Monday 8PM UTC)
public/                       # Static assets (images, icons, resume PDF, robots.txt, site.webmanifest)
```

### Page Structure (Single-Page Portfolio)
The home page (`app/page.tsx`) renders sections in order: Navbar → Hero → About → Skills → Projects → Experience → BlogPreview → (Education, Certificates) → Contact. All content except blog posts comes from the static `data/portfolio.ts` data file. Navigation uses Lenis smooth-scrolling to `#` anchors.

### Blog System (Sanity CMS + Static Fallback)
1. **Static fallback** — 3 hardcoded blog posts in `data/portfolio.ts` under `blogPosts` (used only if Sanity fetch fails).
2. **Sanity CMS** — dynamic posts fetched via GROQ queries. Blog listing revalidates every 3600s.

The Sanity `post` schema includes: title, slug, excerpt, metaTitle/metaDescription, date, readTime, category, heroLabel, tags, body (Portable Text with h1-h3, normal, blockquote, bullet lists, link annotations, strong/em marks). Full Sanity client config in `sanity/lib/client.ts`.

### AI Blog Pipeline (`scripts/publish-blog.mjs`)
A Node.js ESM script that runs weekly via GitHub Actions (also triggerable manually):
1. **Research** — Serper News API + HN Algolia for trending AI/dev topics (parallel fetch)
2. **Topic Selection** — Gemini picks a specific news-tied topic; self-check loop (max 2 retries) rejects generic topics
3. **SEO** — Google Trends validation + Serper related searches + keyword refinement via Gemini
4. **Content Generation** — Gemini writes a 1500+ word post as Portable Text JSON
5. **Publish** — Sanity client creates the document (skips if slug already exists)

Scripts use `process.env` for secrets and are not imported by the Next.js app. They require `@google/generative-ai`, `@sanity/client`, and `google-trends-api`.

### 3D Hero Canvas (`components/HeroCanvas.tsx`)
A standalone Three.js scene (not react-three-fiber) with wireframe icosahedron, torus ring, particle system, mouse-tracking parallax, and amber/orange accent lighting. Respects `prefers-reduced-motion`.

### Key Conventions
- **Color scheme:** dark bg (`#0a0a0a`), accent orange (`#FF6B00`), white text
- **Typography:** Bebas Neue for headings (uppercase via font), Manrope for body
- **Section components:** use `<SectionTitle>` + orange underline bar (`h-2 w-24 bg-[#FF6B00]`)
- **Metadata URLs:** OpenGraph/twitter card tags use `https://shirazabubakar.vercel.app`
- **Contact form:** uses `mailto:` links (no backend API)
- **Lenis + GSAP:** `LenisProvider` disables Lenis auto-RAF, uses GSAP ticker for integration with ScrollTrigger
- **Path alias:** `@/*` maps to project root
- **GSAP animations:** defined in `lib/animations.ts` (revealText, fadeInSlideUp, staggerCards)
- **ESLint:** Next.js core-web-vitals + TypeScript config
