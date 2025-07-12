import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    // 注意: 'slug'はAstroの予約プロパティで、通常はファイルIDから自動生成されます。
    // フロントマターにslugを追加することで、自動生成されるslugをオーバーライドできます。
    // 'slug'は特別な予約プロパティのため、本来はスキーマに定義不要で、
    // エントリーのdataプロパティにも表示されませんが、型安全性のため明示的に定義しています。
    // 参考: https://docs.astro.build/ja/guides/content-collections/#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%82%B9%E3%83%A9%E3%82%B0%E3%81%AE%E5%AE%9A%E7%BE%A9
    // slug: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };