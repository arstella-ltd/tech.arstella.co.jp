---
title: 'GitHub CLI(gh)で開発効率を劇的に改善する実践ガイド'
pubDate: 2025-07-19
description: 'GitHub CLIを使ってissue管理、PR作成、レビューなどの日常的なGitHub操作を効率化する方法を詳しく解説します。AIツールとの連携方法も紹介。'
author: 'arstella'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'GitHub CLI productivity guide'
tags: ["GitHub", "CLI", "productivity", "git", "開発効率化"]
category: "Tools"
slug: "github-cli-productivity"
---

## はじめに

GitHubでの開発作業、まだブラウザで行っていませんか？

issue確認のためにブラウザを開き、PR作成でまたタブを切り替え、レビューコメントを見るためにさらに画面を行き来する。この繰り返しに疲れを感じたことはありませんか？

GitHub CLI（`gh`コマンド）を使えば、これらすべての操作をターミナルから離れることなく実行できます。本記事では、実際の開発現場で役立つGitHub CLIの活用方法を、具体例を交えて詳しく解説します。

## GitHub CLIとは？なぜ使うべきか？

GitHub CLIは、GitHubが公式に提供するコマンドラインツールです。2020年にリリースされて以来、継続的にアップデートされ、現在では GitHub の主要な機能のほぼすべてをカバーしています。

### Web UIと比較したメリット

1. **コンテキストスイッチの削減**
   - エディタとブラウザの切り替えが不要
   - 開発フローが途切れない

2. **自動化が容易**
   - シェルスクリプトやCI/CDに組み込み可能
   - 繰り返し作業の効率化

3. **高速な操作**
   - APIを直接叩くため、UIの読み込み待ちがない
   - キーボードだけで完結

4. **AIツールとの親和性**
   - Claude CodeやGitHub Copilotからの直接実行
   - コマンドの履歴が残り、再利用しやすい

## インストールと初期設定

### インストール方法

```bash
# macOS (Homebrew)
brew install gh

# Windows (winget)
winget install --id GitHub.cli
```

Linux/Unixでのインストールは[公式ドキュメント](https://github.com/cli/cli/blob/trunk/docs/install_linux.md)を参照してください。各ディストリビューションに対応したインストール方法が詳しく解説されています。

### 認証設定

```bash
# 対話形式で認証
gh auth login

# 認証状態の確認
gh auth status
```

認証時のポイント：
- SSH接続を選択すると、既存のSSHキーを利用可能
- scopeは必要最小限に設定（後から追加可能）

## 日常的な使い方：基本編

### 1. リポジトリ操作

```bash
# リポジトリのクローン（自動的にupstreamも設定）
gh repo clone owner/repo

# 現在のリポジトリ情報を表示
gh repo view

# ブラウザで開く
gh repo view --web

# フォーク作成
gh repo fork
```

### 2. Issue管理

```bash
# issue一覧を表示
gh issue list

# 自分にアサインされたissueのみ
gh issue list --assignee @me

# 特定のラベルでフィルタ
gh issue list --label "bug" --label "priority:high"

# issue作成（インタラクティブ）
gh issue create

# issue作成（オプション指定）
gh issue create --title "バグ: ログイン時のエラー" \
  --body "再現手順: ..." \
  --label "bug" \
  --assignee @me
```

### 3. Pull Request操作

```bash
# PR一覧
gh pr list

# 現在のブランチからPR作成
gh pr create

# ドラフトPRとして作成
gh pr create --draft

# テンプレートを使用してPR作成
gh pr create --template .github/pull_request_template.md

# PRをチェックアウト
gh pr checkout 123

# PRの詳細表示
gh pr view 123

# PRのdiffを表示
gh pr diff
```

## AIツールとの連携

### Claude Codeでの活用例

Claude Codeの記事でも触れましたが、ghコマンドはAIエージェントから直接実行できます：

```bash
# Claude Code内でPR作成
# AIがコミットメッセージを分析して適切なPRタイトルと説明を生成

# 1. 変更内容の確認
gh pr diff

# 2. PR作成（AIが内容を理解して説明文を生成）
gh pr create --title "feat: ユーザー認証機能の実装" \
  --body "## 概要
認証機能を実装しました。

## 変更内容
- JWTトークンベースの認証
- リフレッシュトークンの実装
- セキュリティヘッダーの追加

## テスト
- 単体テスト追加済み
- E2Eテスト追加済み"
```

### GitHub Copilot CLIとの組み合わせ

```bash
# Copilotに質問しながらghコマンドを実行
gh copilot suggest "特定のユーザーが作成したissueを全て閉じる"
gh copilot explain "gh pr checks"
```

## まとめ

GitHub CLIは単なるコマンドラインツールではなく、開発ワークフローを根本的に改善する強力なツールです。

### 導入による効果

1. **時間短縮**: ブラウザ操作と比べて約60%の時間削減
2. **自動化**: 繰り返し作業をスクリプト化
3. **一貫性**: チーム全体で同じワークフローを共有
4. **AI連携**: 最新の開発支援ツールとのシームレスな統合

### 次のステップ

1. まずは`gh pr list`と`gh issue list`から始める
2. よく使うコマンドをエイリアス化
3. チーム独自のワークフローをスクリプト化
4. CI/CDパイプラインに組み込む

GitHub CLIを使いこなすことで、より本質的な開発作業に集中できる環境が整います。ぜひ今日から導入して、その効果を体感してください。

## 参考リンク

- [GitHub CLI公式ドキュメント](https://cli.github.com/manual/)
- [GitHub CLI APIリファレンス](https://docs.github.com/en/rest)
- [jq マニュアル](https://stedolan.github.io/jq/manual/)