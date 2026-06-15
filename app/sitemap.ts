import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { SLUGS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 86400; // Revalidate the sitemap every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shirazabubakar.vercel.app';

  // Fetch all blog post slugs from Sanity
  const blogSlugs = await client.fetch<string[]>(SLUGS_QUERY);

  const blogPosts = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts,
  ];
}
