# Changelog

このプロジェクトのすべての注目すべき変更はこのファイルに記録されます。

フォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.1.0/)に基づいており、
このプロジェクトは[Semantic Versioning](https://semver.org/spec/v2.0.0.html)に準拠しています。

## [Unreleased]

## [0.3.0] - 2025-07-13

### Added
- プロフェッショナルなデザインシステムの構築
  - Google Fonts導入（Inter + JetBrains Mono）
  - 洗練されたカラーパレットとCSS変数システム
  - 自然な影システム（5段階のelevation）
  - 統一されたスペーシングシステム（8pxベース）
- タイポグラフィの大幅改善
  - 黄金比ベースのフォントスケール
  - 最適化された文字間隔と行間
  - 読みやすさを重視した記事ページデザイン
- マイクロインタラクションの実装
  - CSS-onlyの滑らかなアニメーション
  - タッチフレンドリーなUI（44pxタップターゲット）
  - ホバーエフェクトとフォーカス状態の改善
- ヒーローセクションの刷新
  - インパクトのあるタイトルデザイン
  - AI活用を特徴としたブランディング
  - ソーシャルプルーフの追加
- レスポンシブデザインの全面的な実装
  - CSS-Onlyのモバイルメニュー（TailwindCSSのpeerクラスを活用）
  - ブログ記事ページのモバイル対応（目次・著者情報の配置最適化）
  - すべてのページでモバイルファーストアプローチを採用
  - タッチフレンドリーなインターフェース（44pxのタップターゲット）
  - セーフエリア対応（iPhone X以降）
  - スムーズスクロールとフォーカス管理の改善

### Improved
- ブログカードデザインの洗練
- 記事ページの読みやすさ向上
- ヘッダーナビゲーションの改善

### Fixed
- Chrome/Edgeでのリンク動作問題
- グラデーションテキストの文字切れ
- WebKit系ブラウザでのbackground-clip競合問題
- CSS変数のフォールバック不足

### Changed
- ブログ一覧ページをシンプルなデザインに調整（可読性重視）

## [0.2.0] - 2025-07-13

### Added
- カテゴリー・タグ機能
  - カテゴリー一覧ページ（/categories/）
  - カテゴリー別記事一覧ページ（/categories/[category]/）
  - タグ一覧ページ（/tags/）
  - タグ別記事一覧ページ（/tags/[tag]/）
  - 記事からカテゴリー・タグへのリンク
- ページネーション機能
  - ブログ一覧、カテゴリー別、タグ別の全ページで実装
  - 1ページあたり10件表示
  - レスポンシブ対応のUIコンポーネント
- 著者管理システム
  - Content Collectionsで著者情報を管理
  - 記事に著者を紐付け
  - 著者プロフィール表示コンポーネント
- 目次（TOC）機能
  - 記事の見出しから自動生成
  - サイドバーに固定表示
  - スムーズスクロール対応
- RSS/Atomフィード機能（@astrojs/rss使用）
  - `/rss.xml`でRSSフィードを配信
  - `/atom.xml`でAtomフィードを配信  
  - HTMLヘッダーに自動検出用のリンクを追加
- 記事の最終更新日表示機能
  - コンテンツスキーマに`updatedDate`フィールドを追加
  - 記事ページで更新日を表示（公開日の横に「更新: YYYY/MM/DD」形式）

## [0.1.0] - 2025-07-12

### Added
- プロジェクトの初期セットアップ
- CLAUDE.mdによる作業ルールとGitワークフローの定義
- GitHub Organization「arstella-ltd」の作成
- GitHubリポジトリ「tech.arstella.co.jp」の作成（Public）
- Astroプロジェクトの初期化（TypeScript有効）
- TailwindCSSの統合
- Content Collectionsの設定（ブログ記事管理）
- 最小限のページ構成を実装
  - ホームページ（最新記事3件表示）
  - ブログ一覧ページ
  - ブログ記事詳細ページ
  - 404エラーページ
  - 共通ヘッダー・フッターコンポーネント
- サンプルブログ記事2本
  - TypeScriptベストプラクティス
  - Gitワークフロー
- ブログ記事用のproseスタイリング
- カスタムslug機能（日付を含まないURL）
- SEO基本対策
  - astro-seoによるメタタグ管理
  - Open GraphとTwitter Card対応
  - robots.txtの設置
  - sitemap.xmlの自動生成（@astrojs/sitemap）
- Cloudflare Workersデプロイ設定（wrangler）
- GitHub Actionsによる自動デプロイ設定

### Changed
- devスクリプトに`--host 0.0.0.0`オプションを追加（外部アクセス対応）
- LICENSEファイルをLICENSE.mdに変更
- MIT Licenseの完全な原文を追加
- GitHubリンクをorganization名「arstella-ltd」に修正

### Fixed
- ブログ記事のslugプロパティをAstroの予約プロパティとして正しく使用

### Security
- Cloudflare APIトークンの必要権限を明確化

## プロジェクト情報

- **URL**: https://tech.arstella.co.jp
- **企業サイト**: https://arstella.co.jp
- **リポジトリ**: https://github.com/arstella-ltd/tech.arstella.co.jp
- **ホスティング**: Cloudflare Workers
- **フレームワーク**: Astro v5 + TailwindCSS
- **パッケージマネージャー**: pnpm

## ライセンス

- ブログ記事本文: CC BY-NC-SA 4.0
- 記事内のコード例: Apache License 2.0
- サイトのソースコード: MIT License
- 画像・ロゴ: © 2025 Arstella Ltd. All rights reserved.