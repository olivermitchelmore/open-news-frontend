import { getCollection, type CollectionEntry } from 'astro:content';
import { getCategory, type Category, type CategorySlug } from './categories';

export type ArticleEntry = CollectionEntry<'articles'>;

export interface ArticleImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: Category;
  label?: string;
  author: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: ArticleImage;
  featured: boolean;
  readingTime: number;
}

const WORDS_PER_MINUTE = 230;

export function toArticle(entry: ArticleEntry): Article {
  const { data } = entry;
  const words = entry.body?.split(/\s+/).filter(Boolean).length ?? 0;

  return {
    slug: entry.id,
    title: data.title,
    description: data.description,
    category: getCategory(data.category)!,
    label: data.label,
    author: data.author,
    publishDate: data.publishDate,
    updatedDate: data.updatedDate,
    image: data.image,
    featured: data.featured,
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

const newestFirst = (a: Article, b: Article) => b.publishDate.getTime() - a.publishDate.getTime();

export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles');
  return entries.map(toArticle).sort(newestFirst);
}

export async function getArticlesByCategory(slug: CategorySlug): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.category.slug === slug);
}

export async function getRelated(article: Article, limit = 3): Promise<Article[]> {
  const others = (await getArticles()).filter((a) => a.slug !== article.slug);
  const sameCategory = others.filter((a) => a.category.slug === article.category.slug);
  const rest = others.filter((a) => a.category.slug !== article.category.slug);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Stand-in until the API provides readership data: the newest story from each section. */
export async function getMostRead(limit = 5): Promise<Article[]> {
  const seen = new Set<string>();
  return (await getArticles())
    .filter((a) => !seen.has(a.category.slug) && seen.add(a.category.slug))
    .slice(0, limit);
}

/** Hands out each article at most once, so a page never repeats a story. */
export function createPicker(pool: Article[]) {
  const used = new Set<string>();

  return {
    take(count: number, predicate: (a: Article) => boolean = () => true): Article[] {
      const picked = pool.filter((a) => !used.has(a.slug) && predicate(a)).slice(0, count);
      picked.forEach((a) => used.add(a.slug));
      return picked;
    },
    takeOne(predicate?: (a: Article) => boolean): Article | undefined {
      return this.take(1, predicate)[0];
    },
  };
}
