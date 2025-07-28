---
title: 'CLIツールを広めるために必要なこと - パッケージマネージャー対応の重要性'
pubDate: 2025-07-29
description: 'RedmineCLIを通じて学んだパッケージマネージャー対応の重要性。Homebrew、Scoop、asdf/miseへの対応で見えてきた、それぞれのエコシステムの特徴と実装のコツ。'
author: 'arstella-team'
tags: ["CLI", "Homebrew", "Scoop", "asdf", "mise", "開発ツール", "パッケージマネージャー"]
category: "開発ツール"
slug: "package-managers-for-cli"
---

## はじめに

素晴らしいCLIツールを作った。
でも、誰も使ってくれない。

こんな経験はありませんか？

どんなに便利なツールでも、インストールが面倒だと使われません。
逆に、インストールが簡単なツールは、驚くほど広まりやすい。

今回は、RedmineCLIのパッケージマネージャー対応を通じて学んだ、CLIツールを広めるための実践的なノウハウを共有します。

## なぜパッケージマネージャー対応が必要なのか

### 従来のインストール方法の問題点

GitHubのリリースページからバイナリをダウンロードする方法を考えてみましょう。

1. ブラウザでリリースページを開く
2. 自分のOSに合ったファイルを探す（win-x64? osx-arm64?）
3. ダウンロード
4. 解凍
5. 実行権限を付与（Unix系）
6. パスの通った場所に移動
7. 既存のバージョンがあれば削除

7つもステップがある。
しかも、OSによって手順が違う。

これでは使う気になりません。

### パッケージマネージャーの利点

```bash
# Homebrew
brew install redmine

# Scoop
scoop install redmine

# mise
mise install redmine@latest
```

たった1行。
これが理想です。

さらに、以下のメリットもあります。

- **更新が簡単**: `brew upgrade redmine`
- **削除も簡単**: `brew uninstall redmine`
- **依存関係の管理**: 必要なライブラリも自動インストール
- **バージョン管理**: 特定バージョンの固定も可能

## 各パッケージマネージャーの特徴

RedmineCLIは、主要な3つのパッケージマネージャーに対応しています。
それぞれの特徴と、対応時に学んだことを紹介します。

### Homebrew - macOS/Linuxの定番

Homebrewは、macOSユーザーの大半が使っているパッケージマネージャーです。
最近はLinuxでも人気が高まっています。

#### 実装方法

Homebrew対応は「Tap」と呼ばれる独自リポジトリを作ることから始まります。
[arstella-ltd/homebrew-tap](https://github.com/arstella-ltd/homebrew-tap)では、以下のような構成になっています。

```ruby
# Formula/redmine.rb
class Redmine < Formula
  desc "GitHub CLI-like tool for managing Redmine tickets"
  homepage "https://github.com/arstella-ltd/RedmineCLI"
  version "0.8.2"
  license "MIT"

  on_macos do
    if Hardware::CPU.intel?
      url "https://github.com/arstella-ltd/RedmineCLI/releases/download/v#{version}/redmine-cli-#{version}-osx-x64.zip"
      sha256 "b34854ab0af6d381d28ef8818c257d1280d633739ee2437ffafa18f79cdcd7c2"
    else
      url "https://github.com/arstella-ltd/RedmineCLI/releases/download/v#{version}/redmine-cli-#{version}-osx-arm64.zip"
      sha256 "706a4d5efd312f5af736b36a775123bf87753fcd48df6dcf1e827c77aacf85a8"
    end
  end

  on_linux do
    if Hardware::CPU.intel?
      url "https://github.com/arstella-ltd/RedmineCLI/releases/download/v#{version}/redmine-cli-#{version}-linux-x64.zip"
      sha256 "f835b25f0228405040c08926b7ec4b24db050f133f423d4a78a38abbf3155765"
    else
      url "https://github.com/arstella-ltd/RedmineCLI/releases/download/v#{version}/redmine-cli-#{version}-linux-arm64.zip"
      sha256 "3502535947544a70fc399b59ac91ae31f2916cf605e53caef71cba11684c1784"
    end
  end

  def install
    bin.install "redmine"
  end

  test do
    system bin/"redmine", "--version"
  end
end
```

#### 学んだこと

- **プラットフォーム分岐が簡単**: Intel MacとApple Siliconの処理を分けられる
- **SHA256必須**: セキュリティのため、ダウンロードファイルのハッシュ値検証が必須
- **テストの重要性**: `brew test`でインストール後の動作確認ができる

### Scoop - Windows専用のシンプルさ

ScoopはWindowsのパッケージマネージャーです。
ChocolateyよりもシンプルでGit風な思想が特徴。

#### 実装方法

ScoopはJSONマニフェストで定義します。
[arstella-ltd/scoop-bucket](https://github.com/arstella-ltd/scoop-bucket)では、bucketディレクトリ内にマニフェストを配置しています。

```json
{
    "version": "0.8.2",
    "description": "Command-line interface for Redmine - Efficiently manage Redmine tickets from your terminal",
    "homepage": "https://github.com/arstella-ltd/RedmineCLI",
    "license": "MIT",
    "notes": [
        "RedmineCLI has been installed!",
        "Run 'redmine auth login' to get started.",
        "See https://github.com/arstella-ltd/RedmineCLI for more information."
    ],
    "architecture": {
        "64bit": {
            "url": "https://github.com/arstella-ltd/RedmineCLI/releases/download/v0.8.2/redmine-cli-0.8.2-win-x64.zip",
            "hash": "e47e93639f4719b3c0bdeac9d9ed1277db856ab7fd00146b731b71f445b02d64"
        }
    },
    "bin": "redmine.exe",
    "checkver": {
        "github": "https://github.com/arstella-ltd/RedmineCLI"
    },
    "autoupdate": {
        "architecture": {
            "64bit": {
                "url": "https://github.com/arstella-ltd/RedmineCLI/releases/download/v$version/redmine-cli-$version-win-x64.zip"
            }
        },
        "hash": {
            "url": "$baseurl/redmine-cli-$version-checksums.txt",
            "regex": "$sha256\\s+$fname"
        }
    }
}
```

#### 学んだこと

- **自動更新の仕組み**: `autoupdate`設定により、新しいリリースを自動検出
- **パスの自動設定**: `bin`に指定したファイルは自動的にPATHに追加される
- **管理者権限不要**: ユーザーディレクトリにインストールするため、権限の問題がない

### asdf/mise - 開発者向けバージョン管理

asdfとmiseは、複数バージョンを管理できるツールです。
Node.jsのnvm、Rubyのrbenvのような役割を、あらゆる言語・ツールで実現します。

#### 実装方法

asdfプラグインはシェルスクリプトで実装します。
[arstella-ltd/asdf-redmine](https://github.com/arstella-ltd/asdf-redmine)では、bin/installスクリプトで各プラットフォームに対応しています。

```bash
#!/usr/bin/env bash

set -euo pipefail

GH_REPO="https://github.com/arstella-ltd/RedmineCLI"
TOOL_NAME="redmine"

plugin_dir=$(dirname "$(dirname "${BASH_SOURCE[0]}")")

# shellcheck source=../lib/utils.bash
source "${plugin_dir}/lib/utils.bash"

install_version "$ASDF_INSTALL_TYPE" "$ASDF_INSTALL_VERSION" "$ASDF_INSTALL_PATH"
```

内部的には [lib/utils.bash](https://github.com/arstella-ltd/asdf-redmine/blob/main/lib/utils.bash) を呼び出しています。

このプラグインの特徴として、miseとの互換性も確保されています。
miseユーザーは以下のように使用できます。

```bash
# mise用の設定例（.mise.toml）
[tools]
redmine = "latest"
```

#### 学んだこと

- **プラットフォーム検出の複雑さ**: OS種別とCPUアーキテクチャの組み合わせを正確に判定
- **miseとの互換性**: asdfプラグインはmiseでもそのまま使える
- **バージョンファイルの利便性**: `.tool-versions`でプロジェクトごとの管理が可能

## リリースの自動化

パッケージマネージャー対応で最も重要なのは、リリースの自動化ですが、まだ実現できていません。

### 自動化のメリット

1. **ヒューマンエラーの防止**: ハッシュ値の計算ミスがなくなる
2. **迅速なリリース**: GitHubでリリースするだけで全パッケージマネージャーが更新
3. **一貫性の保証**: すべてのパッケージマネージャーで同じバージョンを提供

## 実装時のつまずきポイント

### プラットフォーム検出の落とし穴

```bash
# NG: unameだけでは不十分
if [[ "$(uname)" == "Darwin" ]]; then
  # Intel MacもApple Siliconも同じ扱いになってしまう
fi

# OK: アーキテクチャも確認
if [[ "$(uname)" == "Darwin" && "$(uname -m)" == "arm64" ]]; then
  # Apple Silicon Mac
fi
```

### ダウンロードURLの一貫性

各パッケージマネージャーが期待するURL形式を統一することが重要です。

```
# 一貫性のある命名規則
redmine-cli-{version}-{platform}.zip

# プラットフォーム名も統一
- osx-x64 (Intel Mac)
- osx-arm64 (Apple Silicon)
- linux-x64
- linux-arm64
- win-x64
```

## 成果と学び

### 複数環境への展開が劇的に楽に

パッケージマネージャー対応の最大の恩恵は、複数の開発環境への展開でした。

以前は新しいマシンをセットアップするたびに、以下の手順が必要でした。
- GitHubのリリースページを開く
- 適切なバイナリを探してダウンロード
- 解凍して、パスを通して...

今では各OSのパッケージマネージャーで一発インストール。
新しいマシンを追加するたびに同じ手順を繰り返す必要がなくなり、セットアップ時間が大幅に短縮されました。

### 開発者としての学び

1. **ユーザビリティの重要性**: 機能よりもインストールの簡単さが普及の鍵
2. **エコシステムへの参加**: 各OSの文化に合わせることの大切さ
3. **自動化の価値**: 手動作業を減らすことで、開発に集中できる

## まとめ

CLIツールを作ったら、パッケージマネージャー対応をしておくと良いでしょう。
自身がよく使うパッケージマネージャーから始めると良いと思います。

1. **Homebrew**: macOS/Linuxユーザーの大半をカバー
2. **Scoop**: Windows開発者に人気
3. **asdf/mise**: バージョン管理が必要な場合

## 参考リンク

- [Homebrew Documentation](https://docs.brew.sh/)
- [Scoop Documentation](https://scoop.sh/)
- [asdf Documentation](https://asdf-vm.com/)
- [mise Documentation](https://mise.jdx.dev/)
- [RedmineCLI](https://github.com/arstella-ltd/RedmineCLI)
- [RedmineCLI Homebrew Tap](https://github.com/arstella-ltd/homebrew-tap)
- [RedmineCLI Scoop Bucket](https://github.com/arstella-ltd/scoop-bucket)
- [RedmineCLI asdf Plugin](https://github.com/arstella-ltd/asdf-redmine)