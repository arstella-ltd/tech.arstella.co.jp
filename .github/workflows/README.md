# GitHub Actions設定

## Cloudflare Workers自動デプロイ

### 必要なシークレット

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください：

- `CLOUDFLARE_API_TOKEN`: Cloudflare APIトークン

### APIトークンの作成方法

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/profile/api-tokens)にアクセス
2. 「Create Token」をクリック
3. 「Custom token」を選択
4. 以下の権限を設定：
   - Account: Cloudflare Workers Scripts:Edit
   - Zone: Workers Routes:Edit（カスタムドメインを使用する場合）
5. トークンを作成してコピー

### ワークフロー

- `main`ブランチへのpush時: 本番環境へ自動デプロイ
- Pull Request時: プレビュー環境へデプロイ