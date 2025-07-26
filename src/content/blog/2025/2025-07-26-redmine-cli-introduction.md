---
title: 'RedmineCLI - ターミナルから離れずにRedmineを操作する新しい体験'
pubDate: 2025-07-26
description: 'GitHub CLIライクなインターフェースでRedmineを操作できるRedmineCLIの概要と使い方を紹介。ターミナルから離れることなくチケット管理を効率化する方法を解説します。'
author: 'arstella-team'
tags: ["CLI", "productivity", "ワークフロー", "開発効率化", "Redmine"]
category: "開発ツール"
slug: "redmine-cli-introduction"
---

## はじめに

Redmineを使っていますか？
私はたくさん使っています。

プロジェクト管理、チケット管理、進捗確認。
毎日のようにRedmineを開いては、チケットを確認し、ステータスを更新し、コメントを残す。
この繰り返しです。

そんな中、Claude CodeやGemini CLIなどのAIエージェントを使っていて、あることに気づきました。
これらのエージェントは、GitHub上の操作を行う際、ほぼ必ず`gh`コマンド（GitHub CLI）を使っているのです。

```bash
# AIエージェントがよく使うコマンド
gh pr create --title "feat: 新機能の実装" --body "..."
gh issue list --assignee @me
gh pr review 123 --approve
```

なぜブラウザ操作ではなく、CLIを選ぶのでしょうか？

その理由は明確です。
CLIの方が検証しやすく、操作しやすく、そして何より自動化しやすいからです。

「それなら、Redmineでも同じことができないか？」

この発想から生まれたのが**RedmineCLI**です。

多くの場合、RedmineをAIエージェントから操作するにはMCPサーバーを開発することになります。
しかし、GitHub CLIの成功例を見れば、CLIツールの方がより実用的なのではないか。
そう考えて開発をスタートしました。

## RedmineCLIとは？なぜ作ったのか？

RedmineCLIは、Redmineのチケット管理をコマンドラインから行えるツールです。
GitHub CLI（`gh`コマンド）のようなインターフェースで、直感的にRedmineを操作できます。

### 開発の背景

私はプロジェクト管理にRedmineを使用していますが、開発中に頻繁にブラウザとターミナルを行き来することに煩わしさを感じていました。

特に以下のような場面で効率の悪さを痛感していました。

1. **コンテキストスイッチのコスト**
   - エディタからブラウザへの切り替え
   - 認証情報の再入力
   - UIの読み込み待ち

2. **反復作業の多さ**
   - 毎朝のチケット確認
   - ステータス更新
   - 定型的なチケット作成

3. **AIツールとの連携**
   - Claude CodeやGemini CLIからRedmineを操作したい
   - 自動化したいが、APIを直接叩くのは面倒

### GitHub CLIから学んだこと

GitHub CLIの優れた点は、単にコマンドラインで操作できることだけではありません。
開発者のワークフローを深く理解した上で設計されていることが、使い心地の良さにつながっています。

RedmineCLIでも、この思想を継承しました。

- **直感的なコマンド体系**: `redmine issue list`のように、自然な英語で操作
- **スマートなデフォルト値**: 引数なしでも、最も使いたい情報を表示
- **美しい出力**: ターミナルでも見やすいテーブル表示

## インストールと初期設定

### インストール方法

RedmineCLIは単一実行ファイルとして配布されており、.NETランタイムのインストールは不要です。

```bash
# Homebrew (macOS/Linux)
brew tap arstella-ltd/homebrew-tap
brew install redmine

# Scoop (Windows)
scoop bucket add arstella https://github.com/arstella-ltd/scoop-bucket
scoop install redmine

# mise (バージョン管理が必要な場合)
mise plugin add redmine https://github.com/arstella-ltd/asdf-redmine.git
mise install redmine@latest
mise use -g redmine@latest
```

### 認証設定

初回起動時は、Redmineサーバーへの接続設定が必要です。

```bash
# 対話形式で認証
redmine auth login

# 以下の情報を入力
# - Redmine URL: https://your-redmine.example.com
# - API Key: （Redmineのマイアカウントページからコピー）

# 接続状態の確認
redmine auth status
```

APIキーは安全にローカルに保存され、次回以降は自動的に使用されます。

## 基本的な使い方

### チケット一覧の確認

最も基本的な操作は、チケット一覧の確認です。

```bash
# オープンなチケットを表示（デフォルト）
redmine issue list

# 自分に割り当てられたチケットを表示
redmine issue list --assignee @me
```

これだけで、以下のような見やすいテーブルが表示されます。

```
┌─────┬──────────────────────────────────────┬───────────┬───────┬──────────┬──────────────┐
│ ID  │ Subject                              │ Status    │ Prior │ Assignee │ Updated      │
├─────┼──────────────────────────────────────┼───────────┼───────┼──────────┼──────────────┤
│ 123 │ ユーザー認証機能の実装               │ 進行中    │ 高    │ @me      │ 2 hours ago  │
│ 124 │ APIドキュメントの更新                │ 新規      │ 通常  │ @me      │ 3 days ago   │
│ 125 │ テストカバレッジの改善               │ 新規      │ 低    │ @me      │ 1 week ago   │
└─────┴──────────────────────────────────────┴───────────┴───────┴──────────┴──────────────┘
```

### フィルタリングオプション

実際の開発では、様々な条件でチケットをフィルタリングしたくなります。
RedmineCLIは豊富なフィルタリングオプションを提供しています。

```bash
# ステータスでフィルタ
redmine issue list --status open    # オープンなチケットのみ
redmine issue list --status closed  # クローズドなチケットのみ

# プロジェクトでフィルタ（名前でもIDでもOK）
redmine issue list --project "Web開発"
redmine issue list -p web-dev

# 担当者でフィルタ
redmine issue list --assignee @me     # 自分に割り当て
redmine issue list --assignee tanaka  # 特定のユーザー

# キーワード検索
redmine issue list --search "ログイン"
redmine issue list -q "バグ"

# 複合条件
redmine issue list --status open --project "緊急対応"
```

### @me特殊値 - 自分を簡単に指定

GitHub CLIから借用した便利な機能が`@me`です。
自分のユーザー名を覚える必要がなく、どの環境でも同じコマンドが使えます。

```bash
# 自分が作成したチケット
redmine issue list -a @me
```

### チケットの詳細表示

チケットの詳細を確認したい場合は、`view`コマンドを使います。

```bash
# チケット詳細を表示
redmine issue view 123

# ブラウザで開く
redmine issue view 123 --web
```

詳細表示では、説明文、コメント、添付ファイル、関連チケットなど、
ブラウザで見るのと同等の情報がターミナル上で確認できます。

### チケットの作成と編集

新しいチケットの作成も、対話形式で簡単に行えます。

```bash
# 対話形式でチケット作成
redmine issue create

# オプション指定で一発作成
redmine issue create \
  --title "ログイン画面のレイアウト崩れを修正" \
  --description "iOSのSafariで表示が崩れる問題の修正" \
  --assignee @me
```

既存チケットの編集も同様です。

```bash
# ステータスを変更
redmine issue edit 123 --status closed

# 担当者を変更
redmine issue edit 123 --assignee yamada

# 複数の項目を一度に更新
redmine issue edit 123 --status "進行中" --progress 50
```

## ショートハンドオプションで更に効率化

頻繁に使うオプションには、短縮形が用意されています。

```bash
# よく使うショートハンド
-p, --project     # プロジェクト指定
-s, --status      # ステータス指定
-a, --assignee    # 担当者指定
-q, --search      # 検索キーワード
-w, --web         # ブラウザで開く
```

### AIツールとの連携

Claude CodeやGemini CLIから直接RedmineCLIを呼び出すことで、
チケット管理も含めた開発フローを自動化できます。
llmsコマンドを使えば、AIエージェントにRedmineCLIの使い方を指示できます。

```bash
# Claude Code内で実行
redmine llms
```

## まとめ

RedmineCLIは、Redmineユーザーの「ターミナルから離れたくない」という願いを叶えるツールです。

### 導入による効果

1. **自動化の可能性**: シェルスクリプトやAIツールとの連携
2. **統一された体験**: GitHub CLIと同じ操作感でRedmineも扱える

### 次のステップ

1. まずは`redmine issue list`から始めてみる
2. AIエージェントとの連携を試す

RedmineCLIを使えば、プロジェクト管理のオーバーヘッドを最小限に抑え、
本来のコーディング作業により多くの時間を割けるようになります。

## 参考リンク

- [RedmineCLI GitHubリポジトリ](https://github.com/arstella-ltd/RedmineCLI)
- [Redmine公式サイト](https://www.redmine.org/)
- [GitHub CLI](https://cli.github.com/)
