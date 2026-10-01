import { defineConfig } from 'astro/config';

const [owner, repository] = (process.env.GITHUB_REPOSITORY || '').split('/');
const isAccountSite = repository?.toLowerCase() === `${owner?.toLowerCase()}.github.io`;

export default defineConfig({
  site:
    process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'https://tae0code.github.io'),
  base: process.env.BASE_PATH || (repository && !isAccountSite ? `/${repository}` : '/'),
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
