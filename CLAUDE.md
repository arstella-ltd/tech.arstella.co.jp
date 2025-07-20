## Git Workflow
- タスクが1つ終わるごとにcommitして。
- commitメッセージは日本語でconv commitの形式にして。
- ブログ記事の変更を行なっている場合は `docs:` をつける。

## Communication
- 日本語で会話して

## Task Management
- タスクが完了したらTODOをチェックして

## Verification
- 検証はdevではなくbuildで行って

## Build
- ビルドはpnpm build

## Design
- デザインはTailwindCSSを使用すること

## Blog
- ブログ記事は `src/content/blog/YYYY/` ディレクトリに配置すること（YYYYは年）
- 記事のauthorはarstella-teamにして
- フロントマターは既存の記事に合わせること（title, pubDate, description, author, tags, category, slug等）
- categoryは既存のものを優先的に使用すること
  - お知らせ
  - Web開発
  - 開発プロセス
  - Development
  - 開発ツール
  - Infrastructure
- 既存のcategoryに該当しない場合のみ新規作成

## Release
- バージョンアップ時はCHANGELOGの更新、package.jsonの更新、TODO.mdの更新、をしてmainにマージした後にgit tag付けをして。