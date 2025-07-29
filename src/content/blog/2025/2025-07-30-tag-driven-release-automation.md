---
title: 'Gitタグ駆動リリースの実装 - CLIツールの継続的デリバリー'
pubDate: 2025-07-30
description: 'RedmineCLIで実践したGitタグ駆動の自動リリースシステム。GitHub Actionsを使って、タグを打つだけでマルチプラットフォーム対応バイナリを配布する仕組みの構築方法。'
author: 'arstella-team'
tags: ["GitHub Actions", "CI/CD", "CLI", "リリース自動化", "DevOps", "バージョニング"]
category: "DevOps"
slug: "tag-driven-release-automation"
---

## はじめに

「v0.8.1」とタグを打つ。
たったそれだけで、Windows、macOS、Linuxの各プラットフォーム向けバイナリが自動的にビルドされ、GitHubのリリースページに公開される。

手動でのビルドやアップロードは一切不要。
これが、Gitタグ駆動リリースの世界です。

今回は、RedmineCLIで実装した自動リリースシステムについて、その設計思想と実装の詳細を共有します。

## なぜタグ駆動なのか

### 従来のリリースフローの問題

以前は、リリースのたびに以下の作業を手動で行っていました。

1. 各プラットフォーム向けにビルド
2. バイナリをZIPに圧縮
3. GitHubのリリースページを作成
4. ファイルを1つずつアップロード
5. リリースノートを記載
6. チェックサムを計算して追記

5つのプラットフォームに対応すると、この作業だけで30分以上かかります。
しかも、ファイル名を間違えたり、アップロードし忘れたり、ヒューマンエラーのリスクも高い。

### Gitタグという自然な節目

Gitタグは、そもそもリリースポイントを示すために存在します。
だったら、タグを打つ行為とリリース作業を直結させるのが自然ではないでしょうか。

```bash
# これだけでリリース完了
git tag v0.8.1
git push origin v0.8.1
```

この2つのコマンドで、すべてが自動的に進行します。

## 実装の全体像

### GitHub Actionsワークフローの構成

リリースワークフローは、3つのジョブで構成されています。

1. **create-release**: リリースの作成
2. **build-and-release**: 各プラットフォームでのビルドとアップロード
3. **generate-checksums**: チェックサムファイルの生成

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  create-release:
    # リリースを作成
    
  build-and-release:
    # 5つのプラットフォームで並列ビルド
    
  generate-checksums:
    # 最後にチェックサムを生成
```

### タグからバージョンを抽出

タグ名からバージョン番号を抽出する処理は、OSによって微妙に異なります。

```yaml
# Unix系
- name: Extract version from tag (Unix)
  if: runner.os != 'Windows'
  id: extract_version_unix
  run: |
    VERSION=${GITHUB_REF#refs/tags/v}
    echo "version=$VERSION" >> $GITHUB_OUTPUT

# Windows
- name: Extract version from tag (Windows)
  if: runner.os == 'Windows'
  id: extract_version_windows
  shell: pwsh
  run: |
    $VERSION = "${{ github.ref_name }}".TrimStart('v')
    echo "version=$VERSION" >> $env:GITHUB_OUTPUT
```

`v0.8.1`というタグから`0.8.1`というバージョン番号を抽出しています。

### プレリリースの自動判定

GitHub Actionsでは、バージョン番号に基づいて自動的にプレリリースを判定できます。

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v2
  with:
    prerelease: ${{ contains(steps.extract_version.outputs.version, '-') }}
```

バージョンに`-`が含まれる場合（例：`v0.8.2-beta`、`v1.0.0-rc1`）は自動的にプレリリースとして扱われます。
これにより、正式版とベータ版を明確に区別できます。

## 配布ファイルの命名規則

### 一貫性の重要性

配布ファイルの命名規則は、最初にしっかりと決めておく必要があります。
後から変更すると、パッケージマネージャーの設定変更が必要になるからです。

```
redmine-cli-{version}-{platform}.zip
```

例
- `redmine-cli-0.8.1-win-x64.zip`
- `redmine-cli-0.8.1-osx-arm64.zip`
- `redmine-cli-0.8.1-linux-x64.zip`

### プラットフォーム識別子の統一

```yaml
strategy:
  matrix:
    config:
      - name: "Windows x64"
        os: windows-latest
        rid: win-x64
        output: redmine.exe
      - name: "macOS ARM64"
        os: macos-latest
        rid: osx-arm64
        output: redmine
```

Runtime Identifier (RID)をそのままファイル名に使用することで、一貫性を保っています。

## .NETのバージョニング戦略

### 動的バージョン指定

ビルド時にタグから抽出したバージョンを動的に設定します。

```yaml
- name: Publish Native AOT
  run: |
    dotnet publish RedmineCLI/RedmineCLI.csproj \
      -c Release \
      -r ${{ matrix.config.rid }} \
      -p:PublishAot=true \
      -p:StripSymbols=true \
      -p:Version=${{ steps.extract_version.outputs.version }} \
      -p:IncludeSourceRevisionInInformationalVersion=false
```

### 開発ビルドとの使い分け

csprojファイルにはデフォルトバージョンを設定しておきます。

```xml
<PropertyGroup>
  <Version>0.1.0</Version>
</PropertyGroup>
```

開発中のビルドでは、このバージョンにコミットハッシュが付加されます。
```
0.1.0+243a42fff1b8121e722042217735a13662b78eec
```

リリースビルドでは、タグから取得したクリーンなバージョン番号になります。
```
0.8.1
```

## マルチプラットフォーム並列ビルド

### マトリックスビルドの活用

5つのプラットフォームを並列でビルドすることで、リリース時間を大幅に短縮しています。

```yaml
strategy:
  matrix:
    config:
      - name: "Windows x64"
        os: windows-latest
        rid: win-x64
      - name: "macOS x64"
        os: macos-latest
        rid: osx-x64
      - name: "macOS ARM64"
        os: macos-latest
        rid: osx-arm64
      - name: "Linux x64"
        os: ubuntu-latest
        rid: linux-x64
      - name: "Linux ARM64"
        os: ubuntu-24.04-arm
        rid: linux-arm64
```

各プラットフォームで独立してビルドが実行され、完了次第リリースにアップロードされます。

## リリース検証の自動化

### チェックサムの自動生成

すべてのバイナリがアップロードされた後、チェックサムファイルを自動生成します。

```yaml
- name: Generate checksums
  run: |
    cd downloads
    sha256sum *.zip > ../redmine-cli-${{ steps.extract_version.outputs.version }}-checksums.txt
```

ユーザーは、このファイルでダウンロードしたバイナリの整合性を確認できます。

### リリース後の動作確認

実際にリリースされたバイナリをダウンロードして動作確認する方法。

```bash
# GitHub CLIでダウンロード
gh release download v0.8.1 --pattern "*osx-arm64*"

# 解凍して実行
unzip redmine-cli-0.8.1-osx-arm64.zip
./redmine --version
# 出力: 0.8.1
```

## 得られた効果

### リリース時間の短縮

手動作業で時間がかかっていたリリース作業が、タグを打つだけで完了。
実際のビルドとアップロードは数分で完了します。

### ヒューマンエラーの排除

- ファイル名の間違い：命名規則が自動適用される
- アップロード忘れ：すべて自動化
- バージョンの不整合：タグから自動取得

### 頻繁なリリースが可能に

リリース作業の心理的負担がなくなったことで、小さな改善も積極的にリリースできるようになりました。
バグ修正やマイナーアップデートを、ユーザーに素早く届けられます。

## まとめ

Gitタグ駆動リリースは、CLIツール開発において非常に効果的なアプローチです。

### 実装のポイント

1. **命名規則を最初に決める**: 後から変更は困難
2. **バージョニング戦略を明確に**: 開発ビルドとリリースビルドの区別
3. **並列処理を活用**: マトリックスビルドで時間短縮
4. **検証も自動化**: チェックサムの生成まで含める

### 今後の展望

現在は、パッケージマネージャーの更新はまだ半自動です。
将来的には、これも完全自動化したいと考えています。

タグを打つだけですべてが完了する。
それが、理想的な継続的デリバリーの姿です。

## 参考リンク

- [GitHub Actions Documentation](https://docs.github.com/ja/actions)
- [.NET Versioning](https://learn.microsoft.com/ja-jp/dotnet/core/versions/)
- [RedmineCLI Release Workflow](https://github.com/arstella-ltd/RedmineCLI/blob/v0.8.2/.github/workflows/release.yml)