# 企業技術ブログ開発TODO

## バージョンロードマップ
- **v0.1.0** (リリース済): Phase 1 完了 + SEO基本対策
- **v0.2.0** (予定): Phase 2 ブログ機能の強化
- **v0.3.0** (予定): Phase 2 デザイン改善 + GitHub連携
- **v0.4.0** (予定): Phase 3 パフォーマンス最適化
- **v0.5.0** (予定): Phase 3 高度なSEO + ユーザビリティ向上
- **v0.6.0** (予定): Phase 3 アナリティクス
- **v1.0.0** (予定): Phase 4 完了 + 本番運用開始

## プロジェクト情報
- **URL**: tech.arstella.co.jp
- **企業サイト**: arstella.co.jp
- **リポジトリ**: GitHub管理（Public）
- **ホスティング**: Cloudflare Pages
- **フレームワーク**: Astro + TailwindCSS
- **パッケージマネージャー**: pnpm

## Phase 1: 最小限の構成で早期デプロイ（1-2日） ✅ **v0.1.0で完了**

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
- [x] 最小限の構成
  - [x] TypeScript有効化
  - [x] TailwindCSS追加
  - [x] content collectionsの設定

### Cloudflare Pagesへのデプロイ
- [x] Cloudflare Pagesプロジェクトの作成
- [x] GitHubリポジトリの連携
- [x] ビルド設定
  - [x] ビルドコマンド: `pnpm install && pnpm build`
  - [x] ビルド出力ディレクトリ: `dist`
  - [x] ~~環境変数でPNPM_VERSION指定（必要に応じて）~~ → 静的サイトのため不要と判断
- [x] カスタムドメイン（tech.arstella.co.jp）の設定
- [x] 初回デプロイの確認

### 最小限のページ作成
- [x] シンプルなホームページ（/）
- [x] ブログ一覧ページ（/blog）
- [x] ブログ記事ページ（/blog/[slug]）
- [x] 404ページ
- [x] 基本的なヘッダー・フッター

### サンプルコンテンツ
- [x] "Hello World"的なブログ記事を1-2個作成
- [x] 基本的なスタイリング

## Phase 2: 基本機能の追加（1週間）

### SEO基本対策 ✅ **v0.1.0で完了**
- [x] メタタグの設定（astro-seo）
- [x] sitemap.xmlの自動生成（@astrojs/sitemap）
- [x] robots.txtの設定

### ブログ機能の強化 🎯 **v0.2.0予定**
- [ ] カテゴリー・タグ機能
- [ ] ページネーション
- [x] RSS/Atomフィード（@astrojs/rss）
- [ ] 記事の最終更新日表示

### デザイン改善 🎯 **v0.3.0予定**
- [ ] レスポンシブデザインの実装
- [ ] プロのようなレイアウト調整
- [ ] arstella.co.jpへのリンク追加

### GitHub連携 🎯 **v0.3.0予定**
- [ ] 「GitHubで編集」ボタン
- [ ] ソースコードへのリンク

## Phase 3: 高度な機能（2週間）

### パフォーマンス最適化 🎯 **v0.4.0予定**
- [ ] 画像の最適化と遅延読み込み
- [ ] フォントの最適化
- [ ] Core Web Vitalsの改善

### 高度なSEO 🎯 **v0.5.0予定**
- [ ] OGP（Open Graph Protocol）タグ
- [ ] 構造化データ（JSON-LD）
  - [ ] Organization
  - [ ] Article
  - [ ] BreadcrumbList
- [ ] canonical URLの設定

### ユーザビリティ向上 🎯 **v0.5.0予定**
- [ ] 目次（TOC）の自動生成
- [ ] パンくずリスト
- [ ] 関連記事の表示
- [ ] ソーシャルシェアボタン
- [ ] 簡易検索機能（クライアントサイド）

### アナリティクス 🎯 **v0.6.0予定**
- [ ] Google Analytics 4の導入
- [ ] Cloudflare Web Analyticsの設定

## Phase 4: セキュリティと運用（随時） 🎯 **v1.0.0予定**

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

## Phase 5: 将来的な拡張 🔮 **v1.1.0以降**

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