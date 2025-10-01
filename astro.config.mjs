// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://open-news.dev',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/search'),
    }),
  ],
  image: {
    domains: ['images.unsplash.com'],
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
