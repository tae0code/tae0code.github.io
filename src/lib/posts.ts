import { getCollection } from 'astro:content';
export async function publishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}
export function readingMinutes(body?: string) {
  // Korean text has fewer whitespace-separated words; character count is a better approximation.
  return Math.max(1, Math.ceil((body || '').replace(/```[\s\S]*?```/g, '').length / 650));
}
