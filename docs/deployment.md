# 部署指南

LazyEmbed 是完全靜態的專案，可以部署到任何靜態託管服務。以下是幾種常見的部署方式。

## GitHub Pages

GitHub Pages 提供免費的靜態網站託管服務。

### 部署步驟

1. 確保您的專案已推送到 GitHub 儲存庫

2. 推送最新更改：
```bash
git add .
git commit -m "Deploy LazyEmbed"
git push origin main
```

3. 在 GitHub 儲存庫設定中啟用 GitHub Pages：
   - 前往儲存庫的 **Settings** 頁面
   - 選擇 **Pages** 選項
   - 在 **Source** 下選擇分支（通常是 `main`）
   - 選擇根目錄 `/` 作為來源
   - 點擊 **Save**

4. 等待幾分鐘後，您的網站將在 `https://<username>.github.io/<repository>` 上線

## Netlify

Netlify 提供簡單快速的部署體驗，支援持續部署。

### 部署步驟

1. 將專案推送到 Git 儲存庫（GitHub、GitLab 或 Bitbucket）

2. 登入 [Netlify](https://www.netlify.com/)

3. 點擊 **Add new site** > **Import an existing project**

4. 選擇您的 Git 提供商並授權

5. 選擇 LazyEmbed 儲存庫

6. 部署設定：
   - **Build command**: （留空）
   - **Publish directory**: `.`

7. 點擊 **Deploy site**

### 自訂網域

在 Netlify 控制台中，您可以：
- 設定自訂網域
- 啟用 HTTPS
- 配置環境變數

## Vercel

Vercel 提供快速的全球 CDN 部署。

### 部署步驟

1. 安裝 Vercel CLI（如果尚未安裝）：
```bash
npm install -g vercel
```

2. 在專案目錄中執行：
```bash
vercel
```

3. 按照提示登入並配置專案

4. 部署到生產環境：
```bash
vercel --prod
```

### 透過 Git 部署

1. 登入 [Vercel](https://vercel.com/)

2. 點擊 **Add New** > **Project**

3. 匯入您的 Git 儲存庫

4. Vercel 會自動檢測設定並部署

## Cloudflare Workers

Cloudflare Workers 提供全球邊緣運算部署，速度快且可靠。

### 前置需求

- 安裝 [Node.js](https://nodejs.org/)
- 安裝 Wrangler CLI：
```bash
npm install -g wrangler
```
- 擁有 Cloudflare 帳號

### 部署步驟

1. 登入 Cloudflare：
```bash
wrangler login
```

2. 專案已包含 `wrangler.toml` 配置檔案，直接部署：
```bash
wrangler deploy
```

3. 部署成功後，訪問您的網站：
```
https://lazyembed.workers.dev
```

### 配置說明

專案中的 `wrangler.toml` 檔案包含以下配置：

```toml
name = "lazyembed"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[site]
bucket = "./"
```

您可以根據需要修改：
- `name`: Workers 的名稱
- `compatibility_date`: 相容性日期

### 自訂網域

1. 在 Cloudflare Workers 控制台中選擇您的 Worker

2. 前往 **Settings** > **Triggers**

3. 點擊 **Add Custom Domain**

4. 輸入您的網域並完成驗證

## Cloudflare Pages

除了 Workers，您也可以使用 Cloudflare Pages 部署。

### 部署步驟

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. 選擇 **Pages** > **Create a project**

3. 連接您的 Git 儲存庫

4. 部署設定：
   - **Build command**: （留空）
   - **Build output directory**: `/`

5. 點擊 **Save and Deploy**

## 其他平台

LazyEmbed 可以部署到任何支援靜態網站的平台：

### Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

### AWS S3 + CloudFront

1. 建立 S3 儲存貯體
2. 啟用靜態網站託管
3. 上傳檔案
4. 配置 CloudFront 分發

### Azure Static Web Apps

1. 在 Azure Portal 建立 Static Web App
2. 連接 Git 儲存庫
3. 自動部署

## 部署檢查清單

部署前請確認：

- [ ] 所有檔案已提交到 Git
- [ ] 測試本地功能正常運作
- [ ] 檢查瀏覽器控制台無錯誤
- [ ] 驗證所有小工具路徑正確
- [ ] 確認樣式和 JavaScript 正常載入

## 故障排除

### 小工具無法載入

- 檢查檔案路徑是否正確
- 確認 CORS 設定（如需跨域載入）
- 驗證靜態資源正確部署

### 樣式未套用

- 確認 CSS 檔案路徑正確
- 檢查瀏覽器快取
- 驗證部署時包含了 `css/` 目錄

### JavaScript 錯誤

- 開啟瀏覽器控制台檢查錯誤訊息
- 確認 `js/app.js` 正確載入
- 檢查 localStorage 支援

## 效能優化建議

- 啟用 CDN 加速
- 壓縮 CSS 和 JavaScript 檔案
- 優化圖片大小
- 啟用 Gzip/Brotli 壓縮
- 設定適當的快取標頭
