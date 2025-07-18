---
title: "Astroを選んだ理由とCloudflareで実現する高速配信"
description: "静的サイトジェネレーターの中からAstroを選択した理由と、Cloudflareを使った配信最適化について詳しく解説します。HugoとAstroの比較から、実際の運用経験まで共有します。"
pubDate: 2025-07-15
slug: 'astro-and-cloudflare'
heroImage: ''
category: 'Development'
tags: ["Astro", "Hugo", "Cloudflare", "SSG", "CDN", "技術選定"]
draft: false
---

## はじめに

前回の記事では、企業技術ブログを自作する際に、動的システムではなく静的システムを選択した理由について解説しました。

今回は、静的サイトジェネレーターの中からなぜAstroを選んだのか、そしてCloudflareを使ってどのようにパフォーマンスを最適化したのかについて詳しくお話しします。

## 静的サイトジェネレーターの選定

静的システムに決めた後、どのツールを使うかの選定に入りました。
主な候補は以下の2つでした。

## Hugo vs Astro の比較

**Hugo**

**メリット**
- ビルドが非常に高速（1000記事でも数秒で完了）
- Go言語製のため、単一バイナリで動作し環境構築がシンプル
- 豊富なテーマが公開されており、すぐに使い始められる
- Markdownファイルの処理に特化しており、ブログに最適

**デメリット**
- Go言語のテンプレート構文の学習が必要
- JavaScriptとの連携に制限がある
- 動的な機能の実装が難しい
- カスタマイズの自由度がAstroと比較すると低い

**Astro**

**メリット**
- Node.js環境で動作するため、既存のJavaScript/TypeScriptの知識がそのまま活かせる
- Astroファイルの構文は、JSXに似ており学習コストが低い（フロントマター部分とテンプレート部分が明確に分離されている）
- npmエコシステムをフル活用できるため、必要なパッケージをすぐに導入できる

**デメリット**
- Hugoと比較するとビルド時間が若干長い（ただし、実際には数秒で完了するため、開発効率に影響するほどではない）

## Astroを選択した理由

最終的にAstroを選択した最大の理由は、私の環境でHugoを使用する際に想定外の問題に直面したことです。

当初はHugoのシンプルさに魅力を感じていましたが、実際に試してみると以下の問題に遭遇しました。

1. **パッケージマネージャーの罠**: aptでインストールしたHugoのバージョンが古く、公開されているテーマの多くが動作しなかった
2. **予想外の依存関係**: Hugoを最新版にアップデートしたところ、多くのテーマがビルド時にnpmを必要としていることが判明
3. **環境の複雑化**: 結果的にGo言語とNode.jsの両方の環境が必要になり、当初期待していたシンプルさが失われた

これらの経験から、以下の結論に至りました。

- **依存関係の統一**: すでにNode.jsをメインの開発環境として使用していたため、npmだけで完結するAstroの方が管理しやすい
- **ビルド速度の許容範囲**: Astroのビルド速度はHugoには劣るものの、実用上問題ないレベル（数秒で完了）であることを確認
- **エコシステムの一貫性**: 「結局npmが必要になるなら、最初からNode.jsベースのツールを使った方が良い」という判断

## Cloudflareで更なる高速化を実現

静的システムの利点を最大限に活かすため、CloudflareのCDNを組み合わせることにしました。

**グローバルなエッジネットワーク**: 世界中に配置されたサーバーから最も近い場所から配信され、日本国内だけでなく、海外からのアクセスも高速です。

**無料プランでも十分な機能**: 基本的なCDN機能、SSL証明書の自動発行、DDoS対策が含まれています。

**Cloudflare Workersでの静的ファイル配信**

私の場合、Cloudflare Pagesではなく、Cloudflare Workersを使用して静的ファイルを配信しています。
この方法を選んだ理由は、すでにWorkersの有料プランを契約していたことと、より細かいカスタマイズが可能だったためです。

Workersでは、ビルドした静的ファイルをWorkers Sites機能を使ってアップロードし、エッジネットワーク上で配信します。
カスタムドメインの設定は`wrangler.toml`ファイルに記述することで、コマンド一つでデプロイできるようになりました。

## パフォーマンス計測結果

実際にデプロイしたブログのパフォーマンスを計測したところ、体感だけでなく数値的にも素晴らしい結果が得られました。

**Lighthouse スコア**
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

計測時に興味深い発見がありました。
最初、誤ってHTTP版のURLで計測を行ったところ、Best Practicesのスコアが79点と低い結果になりました。
「なぜこんなに低いのか」と調べたところ、HTTPSを使用していないことが原因でした。
HTTPS版のURLで再計測したところ、期待通り100点を達成しました。

この経験から、パフォーマンス計測時はプロトコルも含めて正確な環境で測定することの重要性を改めて認識しました。

## 実際に使ってみた感想

AstroとCloudflareの組み合わせを採用して、その選択は正しかったと確信しています。

**Astroについて**

Astroは期待以上に使いやすいツールでした。
ビルド速度は十分に高速で、レイアウトの変更やカスタマイズも直感的に行えます。

課題として感じたのは日本語の資料の少なさです。
しかし、これは思わぬ形で解決しました。
コーディングエージェント（Claude Code）を活用することで、英語のドキュメントを読む必要がほとんどなく、スムーズに開発を進められました。
AIツールの進化により、言語の壁が低くなっていることを実感しました。

**Cloudflareについて**

CloudflareのCLIツール「wrangler」は素晴らしい開発体験を提供してくれました。
設定ファイル（wrangler.toml）を一度作成すれば、あとはコマンド一つでデプロイが完了します。

GitHub Actionsとの連携も簡単で、プッシュするだけで自動的にビルドとデプロイが実行される環境を構築できました。

唯一の課題は、APIトークンの権限設定でした。
初回設定時、どの権限が必要なのかがドキュメントから読み取りづらく、エラーメッセージも「権限が不足しています」としか表示されないため、試行錯誤が必要でした。
この点は今後改善されることを期待しています。

## まとめ

静的サイトジェネレーターの選定において、私は以下の理由でAstroを選択しました。

**技術的な理由**
- TypeScriptの標準サポート

**実用的な理由**
- 開発体験の良さ
- 活発なコミュニティ
- 将来性への期待

そして、Cloudflareとの組み合わせにより、高速で安定した、そしてコスト効率の良いブログシステムを構築できました。

3回にわたって、企業技術ブログの構築について解説してきました。
外部サービスか自作か、動的か静的か、どのツールを使うか。
これらの選択に正解はありません。

重要なのは、あなたの状況や要件に最も適した選択をすることです。
この記事が、皆さんの技術ブログ構築の参考になれば幸いです。

Happy Blogging with Astro!