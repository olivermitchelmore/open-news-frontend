// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { API_URL: apiUrl = 'http://127.0.0.1:5000' } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://open-news.dev',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/search'),
    }),
  ],
  image: {
    domains: [new URL(apiUrl).hostname],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
});
