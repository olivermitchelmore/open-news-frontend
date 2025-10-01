import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categorySlugs } from './lib/categories';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(categorySlugs),
    label: z.string().optional(),
    author: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z
      .object({
        src: z.string().url(),
        alt: z.string(),
        caption: z.string().optional(),
        credit: z.string().optional(),
      })
      .optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles };
