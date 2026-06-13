import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolioData.blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = portfolioData.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Post not found | Shiraz Ali",
    };
  }

  return {
    title: `${post.title} | Shiraz Ali`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = portfolioData.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-[#0a0a0a] text-white">
      <article className="relative overflow-hidden px-6 md:px-12 pt-10 pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(255,107,0,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/55 transition hover:text-[#FF6B00]"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Blog
          </Link>

          <header className="pt-16 pb-14">
            <p className="text-[#FF6B00] uppercase tracking-[0.35em] text-xs font-bold mb-5">
              {post.heroLabel}
            </p>
            <h1 className="font-bebas text-6xl md:text-8xl leading-none">
              {post.title}
            </h1>
            <p className="mt-6 text-xl text-white/60 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/50">
              <span className="inline-flex items-center gap-2">
                <Calendar size={17} aria-hidden="true" />
                {new Date(post.date).toLocaleDateString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={17} aria-hidden="true" />
                {post.readTime}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="space-y-12 border-t border-white/10 pt-12">
            {post.body.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-5 font-bebas text-4xl text-white">
                  {section.heading}
                </h2>
                <div className="space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-lg leading-8 text-white/65"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
