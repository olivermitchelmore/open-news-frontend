import { defineCollection, z } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { inferRemoteSize } from 'astro/assets/utils';
import { categorySlugs } from './lib/categories';

const apiUrl = (import.meta.env.API_URL ?? 'http://127.0.0.1:5000').replace(/\/$/, '');

interface ApiArticle {
  slug: string;
  title: string;
  content: string;
  author: string;
  image_filename: string | null;
  description: string | null;
  category: string | null;
  published: string | null;
}

const toText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** Loads articles from the Flask article API. */
function apiLoader(base: string): Loader {
  return {
    name: 'article-api',
    async load({ store, parseData }) {
      const response = await fetch(`${base}/articles`).catch(() => {
        throw new Error(`Could not reach the article API at ${base}. Start it, or set API_URL.`);
      });
      if (!response.ok) throw new Error(`Article API responded with ${response.status}`);
      const rows: ApiArticle[] = await response.json();

      store.clear();
      for (const row of rows) {
        const text = toText(row.content);
        const imageUrl = row.image_filename && `${base}/articles/${encodeURIComponent(row.image_filename)}/image`;
        // the API only checks the file extension, so an upload may not be a real image
        const hasImage = imageUrl ? await inferRemoteSize(imageUrl).then(() => true, () => false) : false;
        const data = await parseData({
          id: row.slug,
          data: {
            title: row.title,
            description: row.description || (text.length > 160 ? `${text.slice(0, 157)}...` : text),
            category: categorySlugs.find((slug) => slug === row.category) ?? categorySlugs[0],
            author: row.author,
            publishDate: row.published ?? new Date(0),
            image: imageUrl && hasImage ? { src: imageUrl, alt: '' } : undefined,
          },
        });
        store.set({ id: row.slug, data, body: text, rendered: { html: row.content } });
      }
    },
  };
}

const articles = defineCollection({
  loader: apiLoader(apiUrl),
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
