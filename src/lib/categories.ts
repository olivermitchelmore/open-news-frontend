export const categories = [
  {
    slug: 'world',
    name: 'World',
    description: 'Reporting from every continent on the events shaping the global story.',
  },
  {
    slug: 'politics',
    name: 'Politics',
    description: 'Power, policy and the people who make the decisions that affect us all.',
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Markets, companies and the forces moving the global economy.',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'The tools, platforms and ideas changing how we live and work.',
  },
  {
    slug: 'science',
    name: 'Science',
    description: 'Discoveries from the lab, the field and the far reaches of space.',
  },
  {
    slug: 'culture',
    name: 'Culture',
    description: 'Books, film, music and the arts, and the people behind them.',
  },
  {
    slug: 'sport',
    name: 'Sport',
    description: 'Results, analysis and the stories behind the scoreline.',
  },
] as const;

export type Category = (typeof categories)[number];
export type CategorySlug = Category['slug'];

export const categorySlugs = categories.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
