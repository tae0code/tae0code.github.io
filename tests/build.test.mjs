import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
assert.ok(existsSync(join(dist, 'index.html')), 'Run npm run build before npm test.');
const home = readFileSync(join(dist, 'index.html'), 'utf8');
const rootCanonical = home.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
assert.ok(rootCanonical, 'The homepage needs a canonical URL.');
const siteRoot = new URL(rootCanonical);
const base = siteRoot.pathname.replace(/\/$/, '');

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? filesIn(join(dir, entry.name)) : [join(dir, entry.name)]);
}
const htmlFiles = filesIn(dist).filter(file => file.endsWith('.html'));

test('all generated pages have unique titles, descriptions, and a single h1', () => {
  const titles = new Set();
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    assert.ok(title, `${file}: title is missing`);
    assert.ok(!titles.has(title), `${file}: duplicate title`);
    titles.add(title);
    assert.match(html, /<meta\b[^>]*name="description"[^>]*content="[^"]+"/, file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: exactly one h1 expected`);
  }
});

test('every internal page and asset link resolves under the configured Pages base path', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (!raw.startsWith('/')) continue;
      const target = new URL(raw, siteRoot);
      assert.ok(target.pathname === base || target.pathname.startsWith(`${base}/`), `${file}: link escaped base: ${raw}`);
      const relative = decodeURIComponent(target.pathname.slice(base.length)).replace(/^\//, '');
      const local = join(dist, relative);
      assert.ok(existsSync(local), `${file}: broken link ${raw}`);
      if (statSync(local).isDirectory()) assert.ok(existsSync(join(local, 'index.html')), `${file}: missing index for ${raw}`);
    }
  }
});

test('article tables of contents point to real headings', () => {
  const articleFiles = htmlFiles.filter(file => file.includes(`${join('writing', '')}/`) && readFileSync(file, 'utf8').includes('article-aside'));
  assert.ok(articleFiles.length > 0);
  for (const file of articleFiles) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(decodeURIComponent(match[1])), `${file}: missing anchor ${match[1]}`);
  }
});

test('feed and sitemap use the deployment origin and exclude the 404 page', () => {
  for (const name of ['rss.xml', 'sitemap.xml']) {
    const xml = readFileSync(join(dist, name), 'utf8');
    for (const match of xml.matchAll(/<(?:link|loc|guid)>([^<]+)<\//g)) {
      const link = new URL(match[1]);
      assert.equal(link.origin, siteRoot.origin);
      assert.ok(link.pathname.startsWith(`${base}/`));
      assert.ok(!link.pathname.includes('404'));
    }
  }
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /Sitemap: https?:\/\//);
});

test('an absent résumé file never produces a broken download button', () => {
  const resume = readFileSync(join(dist, 'resume/index.html'), 'utf8');
  for (const match of resume.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*\bdownload\b/g)) {
    const relative = new URL(match[1], siteRoot).pathname.slice(base.length).replace(/^\//, '');
    assert.ok(existsSync(join(dist, relative)), `Download is missing: ${relative}`);
  }
  assert.match(resume, /data-print/);
});
