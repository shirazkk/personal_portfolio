import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";


import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const metadata = {
  title: "Blogs | Shiraz Abubakar",
  description:
    "Articles by Shiraz Ali on Agentic AI, full-stack AI products, and modern web engineering.",
};

export const revalidate = 3600;

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await client.fetch(POSTS_QUERY);
  } catch (error) {
    console.error("Error fetching posts from Sanity:", error);
  }

  return (
    <main className="min-h-dvh bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden px-6 md:px-12 pt-10 pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/55 transition hover:text-[#FF6B00]"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Home
          </Link>

          <div className="mt-20 max-w-4xl">
            <p className="text-[#FF6B00] uppercase tracking-[0.35em] text-xs font-bold mb-5">
              Thinking in public
            </p>
            <h1 className="font-bebas text-7xl md:text-9xl leading-none">
              Blog
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-white/60 leading-relaxed">
              Notes on shipping agentic AI systems, full-stack product
              workflows, and high-conversion web experiences.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post: BlogPost, index: number) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group min-h-[360px] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/70 hover:bg-white/[0.07]"
                >
                  <div className="mb-12 flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]">
                      <BookOpen size={21} aria-hidden="true" />
                    </span>
                    <span className="font-bebas text-6xl text-white/10">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
                    {post.category} / {post.readTime}
                  </p>
                  <h2 className="mb-5 text-4xl font-bebas leading-none transition group-hover:text-[#FF6B00]">
                    {post.title}
                  </h2>
                  <p className="text-white/55 leading-relaxed">{post.excerpt}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white transition group-hover:text-[#FF6B00]">
                    Read article
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-white/40 text-lg">No posts yet. The AI agent publishes every Monday!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
