---
title: "Cloudflare PagesからCloudflare Workersへ：静的アセットサポートによる新たな展開"
description: "Cloudflareの基本からCloudflare Workers、Pagesの進化、そして2024年の静的アセットサポートによるPagesからWorkersへの移行について解説します"
pubDate: "Jul 16 2025"
author: "arstella-team"
category: "Infrastructure"
tags: ["Cloudflare", "Workers", "Pages", "CDN", "サーバーレス"]
---

## Cloudflareとは

CloudflareはCDN（Content Delivery Network）サービスを提供するアメリカの企業です。
特に無料のCDNを提供していることで広く知られています。

CDNとは、世界中に分散配置されたサーバーを使用して、ウェブコンテンツを高速に配信する仕組みです。
ユーザーに最も近いサーバーからコンテンツを配信することで、ウェブサイトの表示速度を向上させ、サーバーの負荷を軽減します。

Cloudflareの大きな魅力は、既存のサイトに対して簡単にCDNを適用できる点です。
DNSの設定を変更するだけで、すぐにCDNの恩恵を受けることができます。

## Cloudflare Workers

Cloudflare Workersは2017年にリリースされたサービスで、サーバーレスアプリケーションをデプロイできるプラットフォームです。
JavaScriptやTypeScriptで書かれたコードをCloudflareのエッジネットワーク上で実行でき、高いパフォーマンスと低レイテンシを実現します。

## Cloudflare Pages

2020年にリリースされたCloudflare Pagesは、静的サイトホスティングサービスです。
従来のウェブサービスではサーバーを持っていることが前提でしたが、Cloudflare Pagesがサーバーの代わりとなり、高速なアクセスを可能にします。
GitHubなどと連携し、プッシュするだけで自動的にビルド・デプロイが行われる便利な機能も備えています。

## Workersで静的アセットをサポート

2024年9月、Cloudflareは大きな発表を行いました。
Cloudflare Workersが静的アセットをネイティブにサポートするようになったのです。

[フロントエンド、バックエンド、データベースが1つのCloudflare Workerに](https://blog.cloudflare.com/ja-jp/full-stack-development-on-cloudflare-workers/)

この新機能により、静的アセットの配信が無料で利用可能になりました。
WorkersがPagesの機能性を包含するようになりました。
新規プロジェクトでは静的アセットを扱う場合、Workersの使用が推奨されています。

[Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

## PagesからWorkersへの移行方法

既存のPagesプロジェクトをWorkersに移行する手順は以下の通りです。

### 設定ファイルの作成

`wrangler.json`または`wrangler.toml`を作成または変更し、以下の設定を追加します。
Pagesには存在しなかった`compatibility_date`という設定が必要になります。
これはWorkersのAPIの互換性を保証する日付で、新しい機能や動作変更がいつから適用されるかを制御します。
プロジェクトを開始する際は、常に`compatibility_date`を現在の日付に設定する必要があります。

[Compatibility dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)

`[assets]`セクションは、静的アセットの設定を定義します。
`directory`には、ビルドされた静的ファイルが格納されているディレクトリを指定します。
例えば、AstroのようなSSG（静的サイトジェネレーター）を使用する場合、ビルドされたファイルは通常`dist`ディレクトリに出力されます。
この設定により、WorkersがPagesと同様に静的ファイルを配信できるようになります。

```toml
name = "your-project-name"
compatibility_date = "2025-07-16"

[assets]
directory = "./dist"  # ビルド出力ディレクトリを指定
```

### package.jsonの更新

Wranglerをインストールし、デプロイスクリプトを追加します。
`wrangler deploy`コマンドは、設定ファイルに基づいてプロジェクトをCloudflare Workersにデプロイします。
PagesではGitHubなどのリポジトリと連携した自動デプロイが標準でしたが、Workersでは明示的にデプロイコマンドを実行する必要があります。

```json
{
  "devDependencies": {
    "wrangler": "^4.24.3"
  },
  "scripts": {
    "deploy": "wrangler deploy"
  }
}
```

### デプロイ

以下のコマンドでデプロイを実行します。
初回実行時やログインしていない場合は、Cloudflareへのログインが求められます。

```bash
npm run deploy
# または
pnpm run deploy
```

CI/CD環境でデプロイする場合は、`CLOUDFLARE_API_TOKEN`を環境変数に設定する必要があります。
これにより、対話的なログインプロンプトなしで自動デプロイが可能になります。

```bash
export CLOUDFLARE_API_TOKEN="pasteyourtokenhere"
```

[Authenticating Wrangler](https://developers.cloudflare.com/pub-sub/learning/command-line-wrangler/)

### GitHub Actionsでの自動デプロイ

PagesのようにGitHubと連携した自動デプロイを実現したい場合は、GitHub Actionsを使用します。
ワークフローファイルを作成し、リポジトリへのプッシュをトリガーにして、ビルドとデプロイを自動実行するように設定します。
GitHubリポジトリのSecretsに`CLOUDFLARE_API_TOKEN`を設定することで、Pagesと同様にプッシュ時の自動デプロイが可能になります。

### 移行時の注意点

- PagesとWorkersは同じ名前でプロジェクトを作成可能です
- 不要になったPagesプロジェクトは削除できます
- 継続して同じカスタムドメインを使用したい場合は、Pages側のカスタムドメイン設定を解除してから削除する必要があります

## まとめ

Cloudflareの静的アセットサポートにより、WorkersはPagesの機能を完全に包含するようになりました。
新規プロジェクトではWorkersを選択することで、より柔軟で強力なアプリケーション開発が可能になります。
既存のPagesプロジェクトも簡単に移行でき、同じ高いパフォーマンスを維持しながら、より多くの可能性を手に入れることができます。