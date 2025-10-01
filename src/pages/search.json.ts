import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getArticles } from '../lib/articles';

export const GET: APIRoute = async () => {
  const articles = await getArticles();

  const index = await Promise.all(
    articles.map(async (a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      section: a.category.slug,
      sectionName: a.category.name,
      author: a.author,
      date: a.publishDate.toISOString(),
      image: a.image
        ? (await getImage({ src: a.image.src, inferSize: true, width: 240, format: 'webp', quality: 60 })).src
        : null,
    })),
  );

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
