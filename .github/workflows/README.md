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
   - **User**: User Details:Read（必須）
   - **Account**: Cloudflare Workers Scripts:Edit
   - **Account**: Account Settings:Read
   - **Zone**: Workers Routes:Edit（カスタムドメインを使用する場合）
5. トークンを作成してコピー

### 既存のトークンに権限を追加する場合

1. [APIトークン一覧](https://dash.cloudflare.com/profile/api-tokens)から既存のトークンを編集
2. 「User->User Details->Read」権限を追加
3. 変更を保存

### ワークフロー

- `main`ブランチへのpush時: 本番環境へ自動デプロイ
- Pull Request時: プレビュー環境へデプロイ