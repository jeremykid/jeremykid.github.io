import type { APIRoute } from 'astro';
import { getAllPosts, getPostPath, formatDate } from '../utils/posts';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const payload = posts.map((post) => ({
    title: post.data.title,
    slug: post.slug,
    href: getPostPath(post),
    date: formatDate(post.data.date),
    summary: post.data.summary,
    category: post.data.category ?? null,
    tags: post.data.tags
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
};
