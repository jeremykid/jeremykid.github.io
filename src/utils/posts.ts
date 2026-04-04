import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type PublicationEntry = CollectionEntry<'publications'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type NewsEntry = CollectionEntry<'news'>;

export function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]) {
  return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getAllPosts() {
  return sortByDateDesc(await getCollection('posts'));
}

export function getPostPath(post: PostEntry) {
  const year = String(post.data.date.getUTCFullYear());
  const month = String(post.data.date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(post.data.date.getUTCDate()).padStart(2, '0');
  return `/${year}/${month}/${day}/${post.slug}/`;
}

export function formatDate(date: Date, format: 'long' | 'month' | 'year' = 'long') {
  const options =
    format === 'month'
      ? { year: 'numeric', month: 'long', timeZone: 'UTC' }
      : format === 'year'
        ? { year: 'numeric', timeZone: 'UTC' }
        : { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };

  return new Intl.DateTimeFormat('en-CA', options as Intl.DateTimeFormatOptions).format(date);
}

export function legacySegment(value: string) {
  return value
    .trim()
    .replace(/[_,]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function summarizeMarkdown(markdown: string, length = 180) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= length) {
    return plainText;
  }

  return `${plainText.slice(0, length).trimEnd()}...`;
}

export async function getTagMap() {
  const posts = await getAllPosts();
  const map = new Map<string, { label: string; posts: PostEntry[] }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = legacySegment(tag);
      const existing = map.get(slug);

      if (existing) {
        existing.posts.push(post);
      } else {
        map.set(slug, { label: tag, posts: [post] });
      }
    }

    for (const legacyTag of post.data.legacyTagSlugs) {
      const existing = map.get(legacyTag);
      const label = legacyTag.replace(/-/g, ' ');

      if (existing) {
        existing.posts.push(post);
      } else {
        map.set(legacyTag, { label, posts: [post] });
      }
    }
  }

  return map;
}

export async function getCategoryMap() {
  const posts = await getAllPosts();
  const map = new Map<string, { label: string; posts: PostEntry[] }>();

  for (const post of posts) {
    if (!post.data.category) {
      continue;
    }

    const slug = legacySegment(post.data.category);
    const existing = map.get(slug);

    if (existing) {
      existing.posts.push(post);
    } else {
      map.set(slug, { label: post.data.category, posts: [post] });
    }
  }

  return map;
}

export function groupPostsByYear(posts: PostEntry[]) {
  return posts.reduce<Record<string, PostEntry[]>>((acc, post) => {
    const year = String(post.data.date.getUTCFullYear());
    acc[year] ??= [];
    acc[year].push(post);
    return acc;
  }, {});
}

export function groupPostsByMonth(posts: PostEntry[]) {
  return posts.reduce<Record<string, PostEntry[]>>((acc, post) => {
    const key = `${post.data.date.getUTCFullYear()}-${String(post.data.date.getUTCMonth() + 1).padStart(2, '0')}`;
    acc[key] ??= [];
    acc[key].push(post);
    return acc;
  }, {});
}
