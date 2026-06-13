import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { POST_QUERY, SLUGS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";


type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch(SLUGS_QUERY);
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return {
      title: "Post not found | Shiraz Ali",
    };
  }

  return {
    title: `${post.metaTitle || post.title} | Shiraz Ali`,
    description: post.metaDescription || post.excerpt,
  };
}

const ptComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 font-bebas text-5xl md:text-7xl text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-10 font-bebas text-4xl text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 font-bebas text-3xl text-white">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg leading-8 text-white/65 mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#FF6B00] pl-6 my-8 italic text-white/80 text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-3 mb-8 text-white/65 text-lg">
        {children}
      </ul>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-[#FF6B00] underline transition hover:text-[#FF8533]"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

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
              {post.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="border-t border-white/10 pt-12">
            <div className="portable-text">
              <PortableText value={post.body} components={ptComponents} />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
