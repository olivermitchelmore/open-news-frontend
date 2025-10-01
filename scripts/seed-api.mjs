#!/usr/bin/env node

// Posts the demo articles in demo-articles/ to the article API, so the API has
// content to serve. Articles the API already has are skipped.

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = './demo-articles';
const API_URL = (process.env.API_URL ?? 'http://127.0.0.1:5000').replace(/\/$/, '');

const existing = new Set((await (await fetch(`${API_URL}/articles`)).json()).map((a) => a.title));

const articles = readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith('.md'))
  .map((file) => matter(readFileSync(join(CONTENT_DIR, file), 'utf-8')))
  .sort((a, b) => new Date(a.data.publishDate) - new Date(b.data.publishDate));

for (const { data, content } of articles) {
  if (existing.has(data.title)) {
    console.log(`skipped  ${data.title}`);
    continue;
  }

  const form = new FormData();
  form.set('title', data.title);
  form.set('article_content', content);
  form.set('author-name', data.author);
  form.set('description', data.description);
  form.set('category', data.category);

  if (data.image?.src) {
    const image = await fetch(data.image.src);
    if (image.ok) form.set('ArticleImage', await image.blob(), 'image.jpg');
  }

  const response = await fetch(`${API_URL}/articles`, { method: 'POST', body: form });
  console.log(`${response.ok ? 'created ' : `failed ${response.status}`} ${data.title}`);
}
