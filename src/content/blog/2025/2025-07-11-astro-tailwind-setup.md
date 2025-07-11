---
title: 'AstroとTailwindCSSで技術ブログを構築する'
description: 'Astro v5とTailwindCSSを使用して、高速でモダンな技術ブログを構築する方法を解説します。'
pubDate: 2025-07-11
category: 'Web開発'
tags: ['astro', 'tailwindcss', 'static-site-generator']
---

# AstroとTailwindCSSで技術ブログを構築する

このブログは、Astro v5とTailwindCSSを使用して構築されています。今回は、その構築手順と選定理由について解説します。

## なぜAstroを選んだのか

Astroを選んだ理由は以下の通りです：

1. **高速なビルド**: 静的サイトジェネレーターとして非常に高速
2. **Content Collections**: Markdownベースのコンテンツ管理が簡単
3. **TypeScriptサポート**: 型安全な開発が可能
4. **柔軟性**: 必要に応じてReactやVueなどのコンポーネントも使用可能

## セットアップ手順

### 1. Astroプロジェクトの初期化

```bash
pnpm create astro@latest
```

### 2. TailwindCSSの追加

```bash
pnpm astro add tailwind
```

### 3. Content Collectionsの設定

`src/content/config.ts`でブログ記事のスキーマを定義：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

## まとめ

AstroとTailwindCSSの組み合わせにより、高速でメンテナンスしやすい技術ブログを構築できました。今後も改善を続けていきます。