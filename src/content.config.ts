import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './content/articles' }),
  schema: z.object({
    title: z.preprocess(
      (val) =>
        typeof val === 'object' && val !== null && 'name' in (val as object)
          ? (val as { name: string }).name
          : val,
      z.string()
    ),
    tag: z.string().default('Case Study'),
    date: z.coerce.date(),
    excerpt: z.string().default(''),
    readTime: z.string().optional(),
    coverImage: z.string().nullable().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(0),
    stats: z
      .array(
        z.object({
          num: z.string(),
          label: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { articles };
