import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import SectionTitle from "./SectionTitle";

export default function BlogPreview() {
  return (
    <section id="blog" className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div>
          <p className="text-[#FF6B00] uppercase tracking-[0.35em] text-xs font-bold mb-4">
            Field notes
          </p>
          <SectionTitle title="Blog" />
          <div className="h-2 w-24 bg-[#FF6B00]" />
        </div>
        <div className="max-w-md">
          <p className="text-white/55 text-lg leading-relaxed">
            Practical notes on agentic systems, AI product workflows, and the
            engineering choices behind modern full-stack AI apps.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex min-h-11 items-center gap-2 border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            Read all posts
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {portfolioData.blogPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group min-h-[320px] border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/70 hover:bg-white/[0.07]"
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]">
                <BookOpen size={20} aria-hidden="true" />
              </span>
              <span className="font-bebas text-5xl text-white/10">
                0{index + 1}
              </span>
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#FF6B00]">
              {post.category} / {post.readTime}
            </p>
            <h3 className="mb-4 text-3xl font-bebas leading-none transition group-hover:text-[#FF6B00]">
              {post.title}
            </h3>
            <p className="text-white/55 leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
