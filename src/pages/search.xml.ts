import type { APIRoute } from 'astro';
import { getAllPosts, getPostPath } from '../utils/posts';

export const prerender = true;

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (post) => `<entry>
  <title>${xmlEscape(post.data.title)}</title>
  <url>${xmlEscape(getPostPath(post))}</url>
  <content type="text"><![CDATA[${post.data.summary}]]></content>
</entry>`
    )
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<search>
${items}
</search>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
