import type { APIRoute } from 'astro';
import { getArticles } from '../lib/articles';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');
  const articles = (await getArticles()).slice(0, 50);

  const items = articles
    .map((a) => {
      const link = new URL(`/article/${a.slug}/`, base).href;
      return `    <item>
      <title>${escape(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escape(a.description)}</description>
      <category>${escape(a.category.name)}</category>
      <dc:creator>${escape(a.author)}</dc:creator>
      <pubDate>${a.publishDate.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Open News</title>
    <link>${base.href}</link>
    <description>Independent reporting from around the world.</description>
    <language>en-gb</language>
    <atom:link href="${new URL('/rss.xml', base).href}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
