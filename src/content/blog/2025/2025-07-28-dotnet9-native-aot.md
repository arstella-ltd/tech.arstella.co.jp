---
title: '.NET 9 Native AOTビルドの実践 - CLIツールで15ms起動を実現'
pubDate: 2025-07-28
description: 'RedmineCLI開発を通じて学んだ.NET 9のNative AOTビルドの実践的なノウハウ。起動時間15ms、バイナリサイズ18MBを実現するための設計パターンと具体的な実装方法を解説します。'
author: 'arstella-team'
tags: [".NET", "Native AOT", "CLI", "開発ツール", "パフォーマンス"]
category: "Development"
slug: "dotnet9-native-aot"
---

## はじめに

CLIツールを作っていて、こんな悩みはありませんか？

「.NETランタイムのインストールが面倒」
「起動に時間がかかる」
「配布するファイルが多すぎる」

私もRedmineCLIを開発する中で、同じ悩みを抱えていました。
そこで出会ったのが、.NET 9のNative AOT（Ahead-Of-Time）コンパイルです。

本記事では、RedmineCLIでNative AOTを採用し、起動時間15ms、バイナリサイズ18MBを実現した具体的な方法を共有します。

## Native AOTとは何か

Native AOTは、.NETアプリケーションを事前にネイティブコードにコンパイルする技術です。

従来の.NETアプリケーションの特徴。
- 実行時にJIT（Just-In-Time）コンパイル
- .NETランタイムが必要
- 初回起動が遅い

Native AOTアプリケーションの特徴。
- ビルド時に完全にネイティブコード化
- ランタイム不要の単一実行ファイル
- 即座に起動

### なぜCLIツールにNative AOTが最適なのか

CLIツールの特徴を考えてみましょう。

1. **頻繁に起動・終了する**
   - コマンドを打つたびに起動
   - 起動時間は体感速度に直結

2. **配布のシンプルさが重要**
   - 単一ファイルが理想
   - 依存関係は少ないほど良い

3. **リフレクションの使用が限定的**
   - 複雑な動的処理は不要
   - コマンドライン解析程度

これらの特徴は、まさにNative AOTの得意とする領域です。

## RedmineCLIでの実装

### 基本設定

まず、プロジェクトファイルでNative AOTを有効にします。

```xml
<PropertyGroup>
  <TargetFramework>net9.0</TargetFramework>
  
  <!-- Native AOT settings -->
  <PublishAot>true</PublishAot>
  <OptimizationPreference>Size</OptimizationPreference>
  <StripSymbols>true</StripSymbols>
</PropertyGroup>
```

各設定の意味を説明します。
- `PublishAot`: Native AOTを有効化
- `OptimizationPreference`: サイズ最適化（CLIツールは起動頻度が高いため）
- `StripSymbols`: シンボル情報を削除してサイズ削減

### System.Text.Json Source Generatorの活用

Native AOTの最大の制約は、リフレクションが使えないことです。
JSONシリアライゼーションでは、Source Generatorを使用してコンパイル時にコードを生成します。

RedmineCLIでは、JsonSerializableAttribute を使用して、シリアライズ/デシリアライズする型（Issue、Project、User など）を事前に登録しています。
また、JsonSourceGenerationOptions でスネークケース変換やインデント設定などのオプションを指定し、専用の JsonSerializerContext を作成しています。

実際の使用時は、この生成されたコンテキストを JsonSerializer のメソッドに渡すことで、リフレクションを使わずに高速な JSON 処理を実現しています。
この方法により、実行時の型情報探索が不要になり、Native AOT との互換性が保たれます。

### リフレクション回避の設計パターン

#### DIコンテナーの明示的な構成

Native AOTでは、リフレクションベースの自動登録が使えないため、すべてのサービスを明示的に登録する必要があります。
RedmineCLIでは、ConfigureServicesメソッドで各サービス（IFileSystem、IConfigService、IRedmineApiClientなど）を一つずつAddSingletonで登録しています。
この方法により、コンパイル時にすべての依存関係が解決され、実行時のリフレクションが不要になります。

#### ファクトリーメソッドの活用

動的な型生成やリフレクションベースのインスタンス作成の代わりに、静的なファクトリーメソッドを使用します。
RedmineCLIでは、各コマンドクラスにCreateメソッドを実装し、必要な依存関係を引数として受け取り、サブコマンドを静的に構築しています。
これにより、コマンドの構造がコンパイル時に確定し、実行時の動的処理が不要になります。

### トリマー警告への対処

Native AOTビルドでは、使用されないコードを削除する「トリミング」が行われます。
サードパーティライブラリで警告が出る場合は、プロジェクトファイルで以下の対処が可能です。

1. **警告の抑制**: TrimmerSingleWarnをfalseに設定し、特定の警告コード（IL2104、IL3053など）をNoWarnプロパティに追加
2. **アセンブリの保護**: TrimmerRootAssemblyで必要なアセンブリ（VYamlなど）を明示的に保護

これらの設定により、トリマーが必要なコードを誤って削除することを防げます。

### 実際のビルドコマンド

プラットフォーム別のビルド例を示します。

```bash
# Windows向け
dotnet publish -c Release -r win-x64 \
  -p:PublishAot=true \
  -p:Version=0.8.1 \
  -p:IncludeSourceRevisionInInformationalVersion=false

# macOS ARM64向け
dotnet publish -c Release -r osx-arm64 \
  -p:PublishAot=true \
  -p:Version=0.8.1

# Linux向け
dotnet publish -c Release -r linux-x64 \
  -p:PublishAot=true \
  -p:Version=0.8.1
```

## 遭遇した困難と解決策

### サードパーティライブラリの互換性

多くのライブラリがリフレクションに依存しており、AOT非対応でした。

**解決策**
- AOT対応ライブラリを選定
- Spectre.Console（v0.50.0以降でAOT対応）
- System.CommandLine（ベータ版だがAOT対応）
- VYaml（YAMLパーサー、トリマー警告はあるが動作）

### 画像処理ライブラリの選定

Sixel画像表示機能で苦労しました。

- System.Drawing.Common → Windowsのみ
- SkiaSharp → ネイティブライブラリが必要でAOT不可
- ImageSharp → ライセンスが商用不向き
- **StbImageSharp** → パブリックドメイン、ピュアC#で完璧！

### デバッグの難しさ

Native AOTでは、スタックトレースが読みにくくなります。

**対策**
- 開発時は通常のビルドを使用
- リリース前にAOTビルドでテスト
- ログ出力を充実させる

### ビルド時間の長さ

Native AOTビルドは通常のビルドより時間がかかります。

**対策**
- CI/CDでのみAOTビルド
- 開発時は通常ビルド
- GitHub Actionsで並列ビルド

## 成果

Native AOT採用により、以下の成果を達成しました。

### パフォーマンス

起動時間の比較（Linux x64での実測）。

```bash
# 通常の.NETアプリ（PublishAOT=false）
$ time bin/Release/net9.0/linux-x64/publish/redmine --version
0.8.1+243a42fff1b8121e722042217735a13662b78eec

real    0m0.165s
user    0m0.140s
sys     0m0.027s

# Native AOT版
$ time redmine --version
0.8.1

real    0m0.015s
user    0m0.012s
sys     0m0.003s
```

**約11倍の高速化！**

通常の.NETアプリでも165msという速さですが、Native AOTなら15msまで短縮。
体感できるレベルの差です。

### バイナリサイズ

通常の.NETアプリケーションとの比較（Linux x64での実測）。

```bash
# 通常の.NETアプリ（PublishAOT=false）
$ ls -lh bin/Release/net9.0/linux-x64/publish/redmine
-rwxr-xr-x 1 coder coder 71M Jul 26 12:33 redmine

# Native AOT版（PublishAOT=true）
$ ls -lh bin/Release/net9.0/linux-x64/publish/redmine
-rwxr-xr-x 1 coder coder 18M Jul 26 12:44 redmine
```

**約4分の1のサイズに削減！**

71MBから18MBへ。
.NETランタイムを含まない単一実行ファイルとしては、十分に実用的なサイズです。

さらに、配布時のZIP圧縮後のサイズはもっと小さくなります。

```
redmine-cli-0.8.1-win-x64.zip      6.33 MiB
redmine-cli-0.8.1-linux-arm64.zip  7.01 MiB
redmine-cli-0.8.1-osx-arm64.zip    7.14 MiB
redmine-cli-0.8.1-linux-x64.zip    7.20 MiB
redmine-cli-0.8.1-osx-x64.zip      7.39 MiB
```

配布ファイルは約6～7MB。
これならGitHubからのダウンロードも一瞬です。

### 配布の簡単さ

```bash
# ダウンロードして
curl -LO https://github.com/.../redmine-cli-osx-arm64.zip
unzip redmine-cli-osx-arm64.zip

# 実行権限を付けて
chmod +x redmine

# すぐ使える！
./redmine auth login
```

.NETランタイムのインストール不要。
これがCLIツールのあるべき姿です。

## まとめ

Native AOTは、CLIツールにとって理想的な技術です。

### 得られたメリット

1. **圧倒的な起動速度**
   - 15msでの起動は体感できるレベル
   - ストレスフリーな操作感

2. **シンプルな配布**
   - 単一実行ファイル
   - 依存関係なし

3. **クロスプラットフォーム対応**
   - 各OS向けに最適化されたバイナリ
   - ARM64もサポート

### 注意点

1. **リフレクションの制限**
   - Source Generatorの活用が必須
   - 設計段階からの考慮が必要

2. **ライブラリの選定**
   - AOT対応を確認
   - ピュアC#実装が理想

3. **ビルドプロセスの複雑化**
   - プラットフォーム別ビルドが必要
   - CI/CDの設定が重要

それでも、これらの制約を上回る価値があります。
特にCLIツールを作るなら、Native AOTは必須の選択肢と言えるでしょう。

RedmineCLIのソースコードは[GitHub](https://github.com/arstella-ltd/RedmineCLI)で公開しています。
Native AOTの実装例として、ぜひ参考にしてください。

## 参考リンク

- [.NET Native AOT deployment](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/)
- [System.Text.Json source generation](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/source-generation)
- [RedmineCLI GitHub Repository](https://github.com/arstella-ltd/RedmineCLI)