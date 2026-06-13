# 🚀 AI-Powered Dynamic Blog Setup Guide

This guide will walk you through the steps required to activate the autonomous blog system on your portfolio.

## 1. Sanity CMS Setup
Sanity is your content backend.

1.  **Create a Project:** Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project.
2.  **Get Project ID:** Copy your **Project ID** from the project dashboard.
3.  **Create API Tokens:**
    - Go to **Settings** > **API** > **Tokens**.
    - Click **Add API Token**.
    - Name: `AI_BLOG_WRITER`.
    - Permissions: **Editor** (This allows the agent to create new posts).
    - Save and copy the token immediately (you won't see it again).
4.  **CORS Origins:**
    - Under **Settings** > **API**, add `http://localhost:3000` and your production URL (e.g., `https://shirazali-portfolio.vercel.app`) to the **CORS Origins** list with "Allow credentials" checked.

## 2. Research API (Serper.dev)
Serper provides the real-time Google search data the agent uses for research.

1.  Go to [serper.dev](https://serper.dev/).
2.  Sign up (they have a generous free tier of 2,500 searches).
3.  Copy your **API Key** from the dashboard.

## 3. AI Generation API (Gemini)
Gemini 3.1 Flash-Lite writes the actual blog posts.

1.  Go to [aistudio.google.com](https://aistudio.google.com/).
2.  Create a new **API Key**.
3.  Copy the key.

---

## 4. Setting Environment Variables

### A. Vercel Dashboard (For the Website)
Go to your **Vercel Project Settings** > **Environment Variables** and add:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `your_id_here`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`

### B. GitHub Actions (For the AI Agent Automation)
Go to your **GitHub Repo** > **Settings** > **Secrets and variables** > **Actions** and add these **Repository Secrets**:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET` (value: `production`)
- `SANITY_WRITE_TOKEN` (The Editor token from Step 1)
- `SERPER_API_KEY`
- `GEMINI_API_KEY`

---

## 5. Testing the System

### Manual Trigger
You don't have to wait until Monday to see if it works!
1. Go to your **GitHub Repository**.
2. Click the **Actions** tab.
3. Select **Publish AI Blog Post** on the left.
4. Click the **Run workflow** dropdown and click the green button.
5. Watch the logs—if successful, a new post will appear in your Sanity dataset and show up on your website in about an hour (due to ISR caching).

## 6. Local Development
If you want to test the frontend locally:
1. Create a `.env.local` file in the root of your project.
2. Add:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your_id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```
3. Run `npm run dev`.

---

## Troubleshooting
- **No posts appearing?** Check the GitHub Actions logs for errors. Common issues are invalid API keys or missing Sanity project permissions.
- **Malformed Content?** The agent is programmed to output strict JSON. If Gemini fails to follow the format, the script will log a "JSON Parse Error".
- **Styling Issues?** The `ptComponents` in `app/blog/[slug]/page.tsx` control the styling of the blog body. You can tweak the Tailwind classes there.
