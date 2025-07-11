# 企業技術ブログ開発TODO

## プロジェクト情報
- **URL**: tech.arstella.co.jp
- **企業サイト**: arstella.co.jp
- **リポジトリ**: GitHub管理（Public）
- **ホスティング**: Cloudflare Pages
- **フレームワーク**: Astro + TailwindCSS
- **パッケージマネージャー**: pnpm

## Phase 1: 最小限の構成で早期デプロイ（1-2日）

### 初期セットアップ
- [x] pnpmのインストール確認（`pnpm --version`）
- [x] GitHub Organization「arstella」の作成
  - [x] Organization設定（プロフィール、ロゴ等）
  - [x] メンバーの招待（必要に応じて）
- [x] GitHubリポジトリの作成（arstella/tech.arstella.co.jp）
  - [x] Publicリポジトリとして作成
  - [x] .gitignoreの設定（node_modules、dist、.env等）
  - [x] 簡易READMEの作成
- [x] Astroプロジェクトの初期化（`pnpm create astro@latest`）
- [ ] 最小限の構成
  - [x] TypeScript有効化
  - [ ] TailwindCSS追加
  - [ ] content collectionsの設定

### 最小限のページ作成
- [ ] シンプルなホームページ（/）
- [ ] ブログ一覧ページ（/blog）
- [ ] ブログ記事ページ（/blog/[slug]）
- [ ] 404ページ
- [ ] 基本的なヘッダー・フッター

### Cloudflare Pagesへのデプロイ
- [ ] Cloudflare Pagesプロジェクトの作成
- [ ] GitHubリポジトリの連携
- [ ] ビルド設定
  - [ ] ビルドコマンド: `pnpm install && pnpm build`
  - [ ] ビルド出力ディレクトリ: `dist`
  - [ ] 環境変数でPNPM_VERSION指定（必要に応じて）
- [ ] カスタムドメイン（tech.arstella.co.jp）の設定
- [ ] 初回デプロイの確認

### サンプルコンテンツ
- [ ] "Hello World"的なブログ記事を1-2個作成
- [ ] 基本的なスタイリング

## Phase 2: 基本機能の追加（1週間）

### SEO基本対策
- [ ] メタタグの設定（astro-seo）
- [ ] sitemap.xmlの自動生成（@astrojs/sitemap）
- [ ] robots.txtの設定

### ブログ機能の強化
- [ ] カテゴリー・タグ機能
- [ ] ページネーション
- [ ] RSS/Atomフィード（@astrojs/rss）
- [ ] 記事の最終更新日表示

### デザイン改善
- [ ] レスポンシブデザインの実装
- [ ] プロのようなレイアウト調整
- [ ] arstella.co.jpへのリンク追加

### GitHub連携
- [ ] 「GitHubで編集」ボタン
- [ ] ソースコードへのリンク

## Phase 3: 高度な機能（2週間）

### パフォーマンス最適化
- [ ] 画像の最適化と遅延読み込み
- [ ] フォントの最適化
- [ ] Core Web Vitalsの改善

### 高度なSEO
- [ ] OGP（Open Graph Protocol）タグ
- [ ] 構造化データ（JSON-LD）
  - [ ] Organization
  - [ ] Article
  - [ ] BreadcrumbList
- [ ] canonical URLの設定

### ユーザビリティ向上
- [ ] 目次（TOC）の自動生成
- [ ] パンくずリスト
- [ ] 関連記事の表示
- [ ] ソーシャルシェアボタン
- [ ] 簡易検索機能（クライアントサイド）

### アナリティクス
- [ ] Google Analytics 4の導入
- [ ] Cloudflare Web Analyticsの設定

## Phase 4: セキュリティと運用（随時）

### セキュリティ
- [ ] Content Security Policy (CSP)
- [ ] HTTPSの強制
- [ ] セキュリティヘッダー
- [ ] Dependabotの設定
- [ ] GitHub Secret Scanning

### 運用改善
- [ ] エラーページのカスタマイズ
- [ ] リダイレクトルール
- [ ] キャッシュルールの最適化
- [ ] プレビューデプロイの活用
- [ ] CODEOWNERSファイル

### ドキュメント
- [ ] README.mdの充実
- [ ] コントリビューションガイド
- [ ] ライセンスの選定（MIT推奨）
- [ ] .env.exampleの作成

## Phase 5: 将来的な拡張

### 高度な機能
- [ ] 全文検索（Algolia等）
- [ ] ダークモード対応
- [ ] Web Mentions
- [ ] PWA対応
- [ ] ニュースレター機能

### コンテンツ管理
- [ ] 執筆者プロフィール機能
- [ ] 下書き管理システム
- [ ] 画像アセット管理の最適化

### 国際化
- [ ] 多言語対応の準備
- [ ] hreflangタグ

## 注意事項
- Phase 1完了後、すぐに本番環境で確認可能
- 各Phaseは並行して進めることも可能
- ユーザーフィードバックを基に優先順位を調整