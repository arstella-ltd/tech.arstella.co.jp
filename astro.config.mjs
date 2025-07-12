// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tech.arstella.co.jp',
  integrations: [
    tailwind(),
    sitemap({
      // 除外するページを指定
      filter: (page) => !page.includes('/404'),
      // カスタムページの追加（必要に応じて）
      customPages: [],
      // changefreqとpriorityの設定
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // i18n設定（将来の多言語対応用）
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja-JP',
        },
      },
    }),
  ],
});
