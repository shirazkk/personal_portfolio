import { defineQuery } from 'next-sanity'

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(date desc) {
    title,
    "slug": slug.current,
    excerpt,
    date,
    readTime,
    category,
    heroLabel,
    tags
  }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    excerpt,
    metaTitle,
    metaDescription,
    date,
    readTime,
    category,
    heroLabel,
    tags,
    body
  }
`)

export const SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`)
