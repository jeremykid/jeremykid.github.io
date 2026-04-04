import { defineCollection, z } from 'astro:content';

const linkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    legacyPath: z.string().optional(),
    legacyTopLevelPaths: z.array(z.string()).default([]),
    legacyTagSlugs: z.array(z.string()).default([])
  })
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.number(),
    authors: z.string(),
    venue: z.string(),
    selected: z.boolean().default(false),
    links: z.array(linkSchema).default([])
  })
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    period: z.string(),
    role: z.string(),
    summary: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    links: z.array(linkSchema).default([])
  })
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
    label: z.string(),
    summary: z.string(),
    link: z.string().optional()
  })
});

export const collections = {
  posts,
  publications,
  projects,
  news
};
