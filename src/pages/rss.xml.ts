import type { APIRoute } from 'astro';
import { publishedPosts } from '../lib/posts';
import { profile } from '../data/profile';
import { url } from '../lib/paths';
import { escapeXml } from '../lib/xml';
export const GET: APIRoute = async ({ site }) => {
  const posts = await publishedPosts();
  const home = new URL(url(), site).href;
  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(profile.name)} — Writing</title><link>${escapeXml(home)}</link><description>${escapeXml(profile.intro)}</description><language>ko</language>${posts.map(post => { const link = new URL(url(`writing/${post.id}/`), site).href; return `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(link)}</link><guid>${escapeXml(link)}</guid><description>${escapeXml(post.data.description)}</description><pubDate>${post.data.date.toUTCString()}</pubDate></item>`; }).join('')}</channel></rss>`;
  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
