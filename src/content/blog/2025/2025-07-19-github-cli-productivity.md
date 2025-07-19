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

# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows (Scoop)
scoop install gh
```

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

## 実践的な活用法：応用編

### 1. コードレビューの効率化

```bash
# PR一覧を見やすく表示（カスタムフォーマット）
gh pr list --json number,title,author,isDraft \
  --jq '.[] | [.number, .title, .author.login, if .isDraft then "DRAFT" else "READY" end] | @tsv'

# レビュー待ちのPRを確認
gh pr list --search "is:pr is:open review-requested:@me"

# PRにコメント
gh pr comment 123 --body "LGTMです！マージして問題ありません。"

# PRをapprove
gh pr review 123 --approve --body "コード確認しました。問題ありません。"

# 変更をリクエスト
gh pr review 123 --request-changes --body "以下の点を修正してください：
- エラーハンドリングの追加
- テストケースの充実"
```

### 2. Issue管理の自動化

```bash
# 複数issueの一括操作
gh issue list --label "bug" --json number \
  --jq '.[].number' | xargs -I {} gh issue edit {} --add-label "in-progress"

# issueのコメントを取得
gh issue view 123 --comments

# issueをPRに変換（開発開始時に便利）
gh issue develop 123 --checkout
```

### 3. GitHub APIの活用

```bash
# リポジトリの統計情報取得
gh api repos/:owner/:repo --jq '.stargazers_count, .forks_count'

# 最近のリリース情報
gh api repos/:owner/:repo/releases/latest

# カスタムクエリでissue検索
gh api search/issues -q "repo:owner/repo is:issue is:open created:>2024-01-01" \
  --jq '.items[] | {number, title, created_at}'

# PR のコメント一覧を取得
gh api repos/:owner/:repo/pulls/123/comments
```

### 4. ワークフローの自動化

```bash
# 毎朝のルーティン：自分のタスク確認
cat > ~/bin/morning-check.sh << 'EOF'
#!/bin/bash
echo "=== 自分にアサインされたIssue ==="
gh issue list --assignee @me --state open

echo -e "\n=== レビュー待ちのPR ==="
gh pr list --search "is:pr is:open review-requested:@me"

echo -e "\n=== 自分が作成したPRの状態 ==="
gh pr list --author @me --state open
EOF

chmod +x ~/bin/morning-check.sh
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

## トラブルシューティング

### よくある問題と解決方法

1. **認証エラー**
```bash
# トークンの再認証
gh auth refresh

# スコープの追加
gh auth refresh -s write:packages
```

2. **権限不足**
```bash
# 現在の権限確認
gh auth status -t

# 必要なスコープを追加
gh auth login --scopes repo,workflow
```

3. **API制限**
```bash
# レート制限の確認
gh api rate_limit

# GraphQL APIを使用して効率化
gh api graphql -f query='
  query {
    viewer {
      pullRequests(first: 100, states: OPEN) {
        nodes { number title }
      }
    }
  }'
```

## 実践的なTips集

### 1. エイリアスの活用

```bash
# ~/.gitconfigまたは~/.config/gh/config.yml に設定
gh alias set prc 'pr create'
gh alias set prl 'pr list --author @me'
gh alias set issues 'issue list --assignee @me'

# 複雑なコマンドもエイリアス化
gh alias set review-requests 'pr list --search "is:pr is:open review-requested:@me"'
```

### 2. 出力フォーマットのカスタマイズ

```bash
# JSON出力をjqで加工
gh issue list --json number,title,labels \
  --jq '.[] | "\(.number): \(.title) [\(.labels | map(.name) | join(", "))]"'

# TSV形式で出力（スプレッドシートに貼り付け可能）
gh pr list --json number,title,author,createdAt \
  --jq '.[] | [.number, .title, .author.login, .createdAt] | @tsv' > prs.tsv
```

### 3. シェルスクリプトとの連携

```bash
#!/bin/bash
# 定期的なリポジトリメンテナンス

# 古いブランチの確認
echo "=== 3ヶ月以上更新されていないブランチ ==="
gh api repos/:owner/:repo/branches --paginate \
  --jq '.[] | select(.commit.commit.author.date < (now - 7776000 | strftime("%Y-%m-%dT%H:%M:%SZ"))) | .name'

# マージ済みPRのブランチ削除
gh pr list --state merged --json number,headRefName \
  --jq '.[] | .headRefName' | xargs -I {} git push origin :{}
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