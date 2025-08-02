---
title: 'gh runでGitHub Actionsのデバッグを効率化する - ターミナルから離れずにワークフローを診断'
pubDate: 2025-08-02
description: 'GitHub CLIのgh runコマンドを使ってGitHub Actionsの実行結果を素早く確認する方法。ブラウザを開かずにワークフローの失敗原因を特定し、デバッグ効率を大幅に向上させる実践的なテクニックを紹介。'
author: 'arstella-team'
tags: ["GitHub", "CLI", "GitHub Actions", "CI/CD", "開発効率化", "デバッグ"]
category: "開発ツール"
slug: "gh-run-debugging"
---

## はじめに

GitHub Actionsのワークフローが失敗した。
さて、原因を調べよう。

従来なら、ブラウザを開いて、GitHubのリポジトリページに移動し、Actionsタブをクリックして、失敗したワークフローを探して、ログを開いて...

待ってください。
もっと簡単な方法があります。

```bash
gh run list --limit 5
```

たった一行のコマンドで、最近の実行結果が一覧表示されます。
ブラウザを開く必要はありません。

今回は、GitHub CLIの`gh run`コマンドを使って、GitHub Actionsのデバッグを効率化する方法を紹介します。

## gh runコマンドの基本

### 実行履歴の確認

まず最も基本的な使い方から。
最近のワークフロー実行状況を確認するには以下のコマンドを使います。

```bash
gh run list
```

デフォルトでは20件表示されますが、`--limit`オプションで件数を調整できます。

```bash
gh run list --limit 5
```

実際の出力例を見てみましょう。

```
completed  failure  docs: CLIツールのパッケージマネージャー比較記事を公開  Deploy to Cloudflare Workers  main  push  16582125244  1m8s  2025-07-28T22:53:26Z
completed  success  docs: Markdownlintの警告に対応                    Deploy to Cloudflare Workers  main  push  16556655369  41s   2025-07-27T23:31:59Z
completed  success  docs: MCP vs CLIの記事を追加                      Deploy to Cloudflare Workers  main  push  16546507364  43s   2025-07-27T02:53:06Z
```

一目で以下の情報が確認できます。
- 実行状態（completed）
- 成功/失敗（success/failure）
- コミットメッセージ
- ワークフロー名
- ブランチ
- トリガーイベント
- 実行ID
- 実行時間
- 実行日時

### 特定のワークフローの詳細確認

失敗したワークフローを見つけたら、その詳細を確認します。

```bash
gh run view 16582125244
```

出力例を示します。

```
X main Deploy to Cloudflare Workers · 16582125244
Triggered via push about 2 minutes ago

JOBS
X Deploy in 1m4s (ID 46900285853)
  ✓ Set up job
  ✓ Checkout
  ✓ Setup Node.js
  ✓ Install pnpm
  ✓ Get pnpm store directory
  ✓ Setup pnpm cache
  ✓ Install dependencies
  ✓ Build
  X Deploy to Cloudflare Workers
  - Preview on Cloudflare Workers
  - Post Setup pnpm cache
  ✓ Post Install pnpm
  - Post Setup Node.js
  ✓ Post Checkout
  ✓ Complete job
```

どのステップで失敗したかが一目瞭然です。

## 失敗原因の特定

### エラーログの確認

最も重要な機能の一つが、失敗したステップのログを直接確認できることです。

```bash
gh run view 16582125244 --log-failed
```

このコマンドは、失敗したステップのログのみを表示します。
長大なログから手動でエラーを探す必要はありません。

実際のエラーログの例を示します。

```
Deploy  Deploy to Cloudflare Workers  2025-07-28T22:54:31.7753906Z ✘ [ERROR] A request to the Cloudflare API (/accounts/.../workers/assets/upload?base64=true) failed.
Deploy  Deploy to Cloudflare Workers  2025-07-28T22:54:31.7775138Z   An unknown error has occurred. Please contact support: https://cfl.re/3WgEyrH [code: -1]
```

### 全ログの確認

より詳細な情報が必要な場合は、全ログを確認できます。

```bash
gh run view 16582125244 --log
```

特定のジョブのログだけを見たい場合は以下のようにします。

```bash
gh run view 16582125244 --job 46900285853 --log
```

## 実践的な使い方

### ワークフローの再実行

エラーの原因が一時的なものだった場合（ネットワークエラーなど）、コマンドラインから直接再実行できます。

```bash
# ワークフロー全体を再実行
gh run rerun 16582125244

# 失敗したジョブのみ再実行
gh run rerun 16582125244 --failed

# TUIで選択して再実行
gh run rerun
? Select a workflow run  [Use arrows to move, type to filter]
> X feat: faviconをArstellaのデザインに変更, Deploy to Cloudflare Workers (main) 301h52m37s ago
  X docs: CLAUDE.mdにブログ記事の配置ルールを追記, Deploy to Cloudflare Workers (main) 302h0m15s ago
  X docs: CloudflareとWorkersに関する技術記事を追加, Deploy to Cloudflare Workers (main) 304h13m53s ago
```

### フィルタリングとソート

特定の条件でワークフローを絞り込むこともできます。

```bash
# 失敗したワークフローのみ表示
gh run list --status failure

# 特定のワークフローのみ表示
gh run list --workflow "Deploy to Cloudflare Workers"

# 特定のブランチのみ表示
gh run list --branch main
```

### リアルタイム監視

実行中のワークフローをリアルタイムで監視することもできます。

```bash
gh run watch
```

最新の実行を自動的に選択して監視します。
特定の実行を監視する場合は以下のようにします。

```bash
gh run watch 16582125244
```

## AIエージェントとの連携

私がgh runコマンドを特に重宝しているのは、AIエージェント（Claude CodeやGemini CLI）との連携です。

たとえば、ワークフローが失敗した時の使い方を見てみましょう。

```bash
# AIエージェントに対して
> gh runの結果みて、原因教えて
```

AIエージェントは以下のようなコマンドを実行します。

1. `gh run list --limit 5` で最近の実行を確認
2. `gh run view <ID>` で失敗した実行の詳細を確認
3. `gh run view <ID> --log-failed` でエラーログを取得

そして、エラーの原因と解決策を提示してくれます。

実際の例では、Cloudflare APIへのアセットアップロードエラーを特定し、以下の原因を提示してくれました。

- Cloudflareのサービス側の一時的な問題
- アップロードするファイルのサイズまたは数の制限
- APIトークンの権限不足
- ネットワークの一時的な問題

## 実例：この技術ブログのCI/CD

実は、この技術ブログ自体もGitHub ActionsでCloudflare Workersへの自動デプロイを行っています。
先ほどの例で示したエラーは、まさにこのブログのデプロイ中に発生したものでした。

### エラーの発生と解決

```bash
# 最初のデプロイが失敗
gh run list --limit 1
# completed  failure  docs: CLIツールのパッケージマネージャー比較記事を公開  Deploy to Cloudflare Workers  main  push  16582125244  1m8s

# エラーログを確認
gh run view 16582125244 --log-failed
# APIError: A request to the Cloudflare API (/accounts/.../workers/assets/upload) failed.
```

原因はCloudflare側のAPIエラーでした。
このようなインフラ側の一時的なエラーは、再実行で解決することが多いです。

```bash
# 失敗したジョブのみ再実行
gh run rerun 16582125244 --failed

# 再実行の結果を確認
gh run list --limit 1
# completed  success  docs: CLIツールのパッケージマネージャー比較記事を公開  Deploy to Cloudflare Workers  main  push  16582125245  42s
```

今度は無事にデプロイに成功しました。

### 学んだこと

1. **一時的なエラーは再実行で解決可能**：特にサードパーティAPIとの通信エラー
2. **`--failed`オプションの有用性**：成功したステップは再実行しない
3. **迅速な問題解決**：ブラウザを開くことなく、数コマンドで診断から解決まで完了

このような実体験を通じて、`gh run`コマンドの価値を改めて実感しています。

## Tips & Tricks

### エイリアスの設定

頻繁に使うコマンドはエイリアスにしておくと便利です。

```bash
# ~/.zshrc or ~/.bashrc
alias grl='gh run list --limit 10'
alias grv='gh run view'
alias grf='gh run view --log-failed'
alias grr='gh run rerun --failed'
```

### JSONフォーマットでの出力

プログラムから利用する場合は、JSON形式で出力できます。

```bash
gh run list --json status,conclusion,name --jq '.[] | select(.conclusion=="failure")'
```

### ワークフローのダウンロード

ログをローカルに保存して詳細に分析したい場合は以下のコマンドを使います。

```bash
gh run download 16582125244
```

アーティファクトもダウンロードできます。

## まとめ

`gh run`コマンドを使えば、GitHub Actionsのデバッグが大幅に効率化されます。

### 主なメリット

1. **高速なアクセス**: ブラウザを開く必要がなく、即座に情報にアクセス
2. **効率的なデバッグ**: 失敗したログだけを抽出して確認
3. **自動化可能**: スクリプトやAIエージェントから利用可能
4. **統合的なワークフロー**: ターミナルから離れずに作業を完結

### 特に便利なコマンド

```bash
# 最近の実行を確認
gh run list --limit 5

# 失敗した実行の詳細を確認
gh run view <RUN_ID>

# エラーログだけを表示
gh run view <RUN_ID> --log-failed

# 失敗したジョブを再実行
gh run rerun <RUN_ID> --failed
```

GitHub Actionsを日常的に使っている開発者なら、これらのコマンドを覚えておくだけで、デバッグ時間を大幅に短縮できるはずです。

ブラウザのタブを増やすのではなく、ターミナルで完結させる。
それが現代の効率的な開発スタイルです。

## 参考リンク

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [gh run reference](https://cli.github.com/manual/gh_run)
- [GitHub Actions Documentation](https://docs.github.com/ja/actions)