---
title: 'RedmineCLIに優先度フィルターを実装した話'
pubDate: 2025-08-01
description: 'RedmineのREST APIでチケット一覧を取得する際、公式ドキュメントには記載されていない優先度フィルターの実装方法を発見。priority_idパラメータを使った実装について解説します。'
author: 'arstella-team'
tags: ["Redmine", "CLI", "開発ツール", "REST API"]
category: "開発ツール"
slug: "redmine-priority-filter"
---

## はじめに

RedmineCLIを開発する中で、「優先度でチケットをフィルタリングしたい」という要望がありました。
しかし、公式ドキュメントを見ても、優先度でフィルタリングする方法が見つからない。
今回は、この問題をどう解決したかを共有します。

## RedmineCLIとは

RedmineCLIは、Redmineをコマンドラインから操作できるツールです。
ターミナルから離れることなく、チケットの作成や更新、一覧表示などができます。

```bash
# チケット一覧を表示
redmine issue list

# テーブル形式で表示される
┌──────┬──────────┬──────────┬─────────┬─────────┬─────────┐
│ ID   │ Subject  │ Priority │ Status  │ Project │ Updated │
├──────┼──────────┼──────────┼─────────┼─────────┼─────────┤
│ 123  │ ログイン │ 高       │ 進行中  │ Web開発 │ 2 hours │
│      │ 機能実装 │          │         │         │ ago     │
└──────┴──────────┴──────────┴─────────┴─────────┴─────────┘
```

内部的には、RedmineのREST APIを使ってデータを取得しています。

## REST APIの仕様

チケット一覧の取得には `/issues.json` エンドポイントを使用します。
[公式Wiki](https://www.redmine.org/projects/redmine/wiki/Rest_Issues)によると、様々なフィルターパラメータが用意されています。

```bash
# ステータスIDでフィルタリング
GET /issues.json?status_id=1

# プロジェクトIDでフィルタリング
GET /issues.json?project_id=1

# 担当者IDでフィルタリング
GET /issues.json?assigned_to_id=me
```

しかし、優先度でフィルタリングするパラメータは記載されていません。

## 隠れたパラメータの発見

実はRedmineのソースコードを調べてみると、`priority_id` というパラメータが存在することがわかりました。
このパラメータは公式ドキュメントには記載されていませんが、実際に動作します。

```bash
# 優先度ID=4（高）のチケットのみ取得
GET /issues.json?priority_id=4
```

## 優先度IDの取得方法

優先度IDを知るには、別のエンドポイントを使用します。
`/enumerations/issue_priorities.json` で優先度の一覧が取得できます。

```json
{
  "issue_priorities": [
    {
      "id": 3,
      "name": "低",
      "is_default": false
    },
    {
      "id": 4,
      "name": "通常",
      "is_default": true
    },
    {
      "id": 5,
      "name": "高",
      "is_default": false
    }
  ]
}
```

このエンドポイントは[Enumerations API](https://www.redmine.org/projects/redmine/wiki/Rest_Enumerations)として公式に文書化されています。

## RedmineCLIでの実装

この発見を基に、RedmineCLIに優先度フィルター機能を実装しました。

```bash
# 優先度「高」のチケットのみ表示
redmine issue list --priority 高

# 優先度IDを直接指定することも可能
redmine issue list --priority-id 5
```

内部では以下の処理を行っています。

1. ユーザーが優先度名を指定した場合、優先度一覧APIを呼び出す
2. 優先度名からIDを取得
3. `priority_id` パラメータを使ってチケット一覧を取得
4. JSONレスポンスをパースしてテーブル形式で表示

## つまずきポイント

実装時につまずいたのは、優先度名が環境によって異なる点でした。
日本語環境では「低め」「通常」「高め」ですが、英語環境では「Low」「Normal」「High」となります。

この問題は、優先度一覧APIのレスポンスを動的に使用することで解決しました。
ユーザーの入力と実際の優先度名を比較して、適切なIDを取得しています。

## まとめ

公式ドキュメントに記載されていないパラメータでも、ソースコードを調べることで発見できることがあります。
今回の `priority_id` パラメータのように、実は存在する便利な機能が隠れているかもしれません。

RedmineCLIの優先度フィルター機能により、緊急度の高いチケットを素早く確認できるようになりました。
コマンドラインから離れることなく、効率的にチケット管理ができます。

## 参考リンク

- [RedmineCLI](https://github.com/arstella-ltd/RedmineCLI)
- [Redmine REST API - Issues](https://www.redmine.org/projects/redmine/wiki/Rest_Issues)
- [Redmine REST API - Enumerations](https://www.redmine.org/projects/redmine/wiki/Rest_Enumerations)