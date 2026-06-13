# GEMINI.md — Shiraz Ali Portfolio

## Project Overview
This is the personal portfolio of **Shiraz Ali**, a Frontend Developer and Agentic AI Developer. The project is a high-performance, visually rich Next.js web application that showcases his skills in modern web development, 3D web experiences, and AI-driven workflows.

- **Primary Goal:** Provide an immersive, interactive showcase of projects, experience, and agentic AI capabilities.
- **Architecture:** Next.js 16 (App Router) with React 19.
- **Visual Style:** High-end "dark mode" aesthetic with significant use of 3D (Three.js), smooth scrolling (Lenis), and complex animations (GSAP).

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS 4.
- **Animations:** GSAP (with `@gsap/react`), ScrollTrigger, Lenis (for smooth scrolling).
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`.
- **Icons:** Lucide-React.
- **Deployment:** Vercel (Frontend), GitHub Actions (AI Agent Automation).

## AI-Powered Dynamic Blog System
The portfolio includes an autonomous blog system that researches, writes, and publishes content every Monday at 8 PM.

- **Content Backend:** Sanity CMS.
- **Automation:** GitHub Actions workflow (`publish-blog.yml`).
- **Research Agent:** Node.js script (`scripts/publish-blog.mjs`) using Serper.dev for trends.
- **Content Generation:** Gemini 3.1 Flash-Lite (via Google Generative AI SDK).
- **Structure:** Content is stored as Portable Text to maintain rich formatting and structured data.

### Required GitHub Secrets
To enable the autonomous blog, add these secrets to your GitHub repository:
- `SANITY_PROJECT_ID`: Your Sanity project identifier.
- `SANITY_DATASET`: Usually "production".
- `SANITY_WRITE_TOKEN`: Sanity API token with write permissions.
- `SERPER_API_KEY`: API key for Google search research.
- `GEMINI_API_KEY`: API key for content generation.

## Building and Running
### Prerequisites
- Node.js (Latest LTS recommended).
- npm, yarn, pnpm, or bun.

### Commands
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (runs on [http://localhost:3000](http://localhost:3000))
- **Production Build:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`

## Development Conventions
- **Component Structure:** Functional components with TypeScript. Prefer small, focused components in `components/`.
- **Client Components:** Use `'use client'` at the top of files that require browser-specific logic (GSAP, R3F, Lenis).
- **Animations:** Always use `useGSAP` hook for GSAP animations to ensure proper cleanup and scoping.
- **Data-Driven UI:** Almost all content (hero text, projects, skills) is pulled from `data/portfolio.ts`. Update the data file to change site content.
- **Styling:** Use Tailwind utility classes. For complex layouts, leverage the standard 8px/4pt spacing system.
- **Accessibility:** Ensure all interactive elements have proper ARIA labels and keyboard focus states.

## Agentic AI Integration
This project is "Agentic-first". It includes a set of custom skills and agents located in `.agents/skills/`.

- **UI/UX Pro Max:** A comprehensive design intelligence system used for ensuring high-quality, professional UI/UX.
- **GSAP Suite:** Specialized skills for core GSAP, timelines, scroll-driven animations, and performance.
- **3D Web Experience:** Guidance for R3F and Three.js implementations.

### Using Skills
When working on this project, prioritize using the custom skills for design or animation decisions:
```bash
# Example: Using UI/UX Pro Max for a new section
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "portfolio project section" --design-system
```

## Key Directories
- `app/`: Next.js App Router routes and layouts.
- `components/`: Reusable UI components.
- `data/`: Centralized portfolio data (`portfolio.ts`).
- `lib/`: Helper functions and animation configurations.
- `public/`: Static assets (images, PDFs, icons).
- `.agents/`: Project-specific AI agent skills and configurations.




