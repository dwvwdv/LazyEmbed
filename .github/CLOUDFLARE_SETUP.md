# Cloudflare Workers 自動部署設置指南

本指南將幫助您配置 GitHub Actions 以自動部署到 Cloudflare Workers。

## 前置需求

1. 一個 Cloudflare 帳號
2. GitHub 儲存庫的管理員權限

## 設置步驟

### 1. 獲取 Cloudflare API Token

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 點擊右上角的個人頭像，選擇 **"My Profile"**
3. 在左側選單中選擇 **"API Tokens"**
4. 點擊 **"Create Token"**
5. 選擇 **"Edit Cloudflare Workers"** 模板，或自訂 token 並設置以下權限：
   - **Account** - `Cloudflare Workers Scripts:Edit`
   - **Zone** - `Workers Routes:Edit` (如果需要自訂域名)
6. 繼續完成創建，複製生成的 **API Token**（只會顯示一次，請妥善保存）

### 2. 獲取 Cloudflare Account ID

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 首頁
2. 在右側欄位中找到 **"Account ID"**
3. 點擊複製按鈕

### 3. 在 GitHub 中設置 Secrets

1. 前往您的 GitHub 儲存庫
2. 點擊 **"Settings"** 標籤
3. 在左側選單中選擇 **"Secrets and variables"** > **"Actions"**
4. 點擊 **"New repository secret"** 按鈕，添加以下兩個 secrets：

   **第一個 Secret：**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 您在步驟 1 中獲取的 API Token

   **第二個 Secret：**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 您在步驟 2 中獲取的 Account ID

### 4. 驗證設置

設置完成後，當您推送代碼到 `main` 分支時，GitHub Actions 將自動觸發部署。

您可以在以下位置查看部署狀態：
- GitHub 儲存庫的 **"Actions"** 標籤

### 5. 查看已部署的應用

部署完成後，您的應用將可以在以下 URL 訪問：
```
https://lazyembed.workers.dev
```

或者根據您的 `wrangler.toml` 配置中定義的自訂域名。

## 工作流觸發條件

GitHub Actions 工作流將在以下情況下觸發：

1. **推送到 main 分支**：自動部署到 production 環境
2. **針對 main 分支的 Pull Request**：運行部署測試（不會實際部署）
3. **手動觸發**：在 Actions 標籤頁中手動運行工作流

## 故障排除

### 部署失敗

如果部署失敗，請檢查：

1. **API Token 權限**：確保 API Token 具有正確的權限
2. **Account ID**：確保 Account ID 正確無誤
3. **wrangler.toml**：檢查配置文件是否正確
4. **Secrets 設置**：確保在 GitHub Secrets 中正確設置了兩個 secrets

### 查看詳細錯誤日誌

1. 前往 GitHub 儲存庫的 **"Actions"** 標籤
2. 點擊失敗的工作流運行
3. 查看詳細的錯誤訊息

## 其他資源

- [Cloudflare Workers 文檔](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文檔](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions 文檔](https://docs.github.com/en/actions)

## 安全注意事項

⚠️ **重要**：
- 絕對不要將 API Token 或 Account ID 直接寫在代碼中
- 始終使用 GitHub Secrets 來存儲敏感信息
- 定期輪換 API Tokens
- 僅授予必要的最小權限

---

如有任何問題，請查閱 [Cloudflare Workers 官方文檔](https://developers.cloudflare.com/workers/) 或提交 Issue。
