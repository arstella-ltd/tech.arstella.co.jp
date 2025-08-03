---
title: '--webオプション誕生秘話 - CLIの限界を超える'
pubDate: 2025-08-04
description: 'CLIツールに--webオプションを実装した理由と、OS別のブラウザ起動処理の泥臭い実装について。CLIとWebのいいとこ取りという発想の背景を紹介します。'
author: 'arstella-team'
tags: ["CLI", "ワークフロー", "UI/UX", "開発効率化"]
category: "開発ツール"
slug: "cli-web-option-story"
---

## はじめに

「CLIで全部やるのは無理がある」

この言葉を心の中でつぶやいたことがある開発者は、私だけではないはずです。

CLIツールを開発していると、必ずぶつかる壁があります。
それは「これ、どう考えてもWebブラウザで見たほうが分かりやすいよね」という瞬間です。

特に以下のようなケースでは、CLIの限界を痛感します。

- 長大な差分の確認
- グラフやチャートの表示
- 複雑なテーブルレイアウト
- 画像を含むコンテンツ
- マークダウンのリッチな表現

そんな時、私たちはどうするでしょうか？

URLをコピーして、ブラウザを開いて、貼り付けて...
この作業を何度も繰り返すうちに、ある考えが浮かびました。

「コマンドから直接ブラウザを開けたら便利じゃないか？」

こうして生まれたのが`--web`オプションです。

## なぜ--webオプションが必要だったのか

### GitHub CLIから学んだこと

実は、この発想は完全にオリジナルではありません。
GitHub CLIには既に`--web`オプションが存在していました。

```bash
# PRをブラウザで開く
gh pr view 123 --web

# issueをブラウザで開く
gh issue view 456 --web
```

このオプションの素晴らしさは、使ってみて初めて分かりました。
CLIで情報を確認し、詳細が必要な時だけブラウザに切り替える。
この流れが驚くほどスムーズなのです。

### RedmineCLIでの実装決断

RedmineCLIを開発していた時、チケットの詳細表示で悩みました。

Redmineのチケットには、以下のような情報が含まれます。
- 説明文（Markdownやtextile形式）
- 添付ファイル（画像、PDF、etc）
- 関連チケットのツリー構造
- ガントチャート
- カスタムフィールド

これらすべてをCLIで美しく表示するのは...正直、無理がありました。

そこで決断しました。
「CLIで全部やろうとするのはやめよう。
適材適所でいこう」

## OS別ブラウザ起動の泥臭い実装

### 最初の甘い見積もり

「ブラウザを開くだけでしょ？簡単じゃん」

最初はそう思っていました。
しかし、実際に実装してみると、OSごとの違いに苦労することになります。

### Windows：予想外の落とし穴

Windowsでは`Process.Start(url)`で簡単に開けると思っていました。

```csharp
// 最初の実装
Process.Start("https://example.com");
```

しかし、.NET Coreでは`UseShellExecute`を明示的に設定する必要がありました。

```csharp
// 修正後
var startInfo = new ProcessStartInfo
{
    FileName = url,
    UseShellExecute = true
};
Process.Start(startInfo);
```

さらに、一部の環境では既定のブラウザが正しく起動しない問題も...

### macOS：xdg-openがない世界

Linuxで使える`xdg-open`がmacOSには存在しません。
代わりに`open`コマンドを使う必要があります。

```csharp
if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
{
    Process.Start("open", url);
}
```

しかし、ここにも罠が。
URLに特殊文字が含まれている場合、適切にエスケープしないと失敗します。

### Linux：ディストリビューションの多様性

Linuxが一番複雑でした。

```csharp
// 様々なブラウザ起動コマンドを試す
string[] commands = { "xdg-open", "gnome-open", "kde-open" };
foreach (var cmd in commands)
{
    try
    {
        Process.Start(cmd, url);
        return;
    }
    catch
    {
        // 次のコマンドを試す
    }
}
```

WSL環境では更に複雑で、Windows側のブラウザを開く必要があります。

## $BROWSER環境変数という救世主

試行錯誤の末、たどり着いたのが`$BROWSER`環境変数の活用でした。

```bash
# ユーザーが好きなブラウザを指定
export BROWSER="firefox"
export BROWSER="/usr/bin/chromium-browser"
```

実装はこうなりました。

```csharp
// 1. $BROWSER環境変数をチェック
var browserEnv = Environment.GetEnvironmentVariable("BROWSER");
if (!string.IsNullOrEmpty(browserEnv))
{
    Process.Start(browserEnv, url);
    return;
}

// 2. OS別のデフォルト処理
if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
{
    // Windows処理
}
else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
{
    // macOS処理
}
else
{
    // Linux処理
}
```

この実装により、ユーザーは自分の環境に合わせて柔軟に設定できるようになりました。

## CLIとWebのいいとこ取り

### 実際の使用例

RedmineCLIでの`--web`オプションの使い方を紹介します。

```bash
# CLIでチケット一覧を確認
redmine issue list

# 気になるチケットの詳細をCLIで確認
redmine issue view 123

# 添付ファイルがあるのでブラウザで確認
redmine issue view 123 --web
```

この流れが本当に快適です。

### ユーザーからのフィードバック

実装後、ユーザーから様々な反応をいただきました。

「これ便利！CLIで探して、詳細はブラウザで見るのが最高」

「WSLでも動くのがありがたい」

「$BROWSER環境変数でブラウザを指定できるのが地味に嬉しい」

特に嬉しかったのは、以下のフィードバックです。

「CLIツールなのに、無理にCLIで完結させようとしていないのがいい。
適材適所って大事ですね」

まさに、私たちが目指していたことでした。

## 実装の教訓

### 完璧主義を捨てる勇気

最初は「CLIツールなんだから、すべてCLIで完結すべき」と考えていました。
しかし、ユーザーの利便性を最優先に考えると、その考えは間違いでした。

### 先人の知恵を活用する

GitHub CLIの`--web`オプションは、多くのユーザーに受け入れられています。
車輪の再発明をせず、良いアイデアは積極的に取り入れるべきです。

### 環境の多様性を受け入れる

OS別の処理は面倒ですが、避けて通れません。
しかし、`$BROWSER`環境変数のような標準的な仕組みを活用することで、
実装の複雑さを軽減できます。

## まとめ

`--web`オプションは、CLIツールの限界を認め、それを超えるための現実的な解決策です。

CLIの良さ
- 高速な操作
- スクリプト化が容易
- キーボードだけで完結

Webの良さ
- リッチな表現
- 直感的なUI
- 視覚的な情報

この2つを組み合わせることで、より良い開発体験を提供できます。

もしあなたがCLIツールを開発しているなら、ぜひ`--web`オプションの実装を検討してみてください。
きっと、ユーザーから「これ便利！」という声が聞こえてくるはずです。

## 参考リンク

- [RedmineCLI GitHubリポジトリ](https://github.com/arstella-ltd/RedmineCLI)
- [GitHub CLI](https://cli.github.com/)
- [WSLでのブラウザ起動について](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps)